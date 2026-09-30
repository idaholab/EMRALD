// Copyright 2026 Battelle Energy Alliance
// Shared WebSocket receive helper. WebSocket.ReceiveAsync returns at most one buffer's worth of
// bytes per call, so a single logical message larger than that buffer arrives in several chunks.
// This reassembles those chunks into the whole message before anyone tries to decode or parse it.

using System;
using System.IO;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace MessageDefLib
{
  /// <summary>
  /// One fully reassembled WebSocket message.
  /// </summary>
  public class WebSocketMessage
  {
    /// <summary>Type of the message received (Text, Binary or Close).</summary>
    public WebSocketMessageType MessageType { get; set; }

    /// <summary>UTF-8 decoded payload for a Text message. Null for Binary, Close and TooLarge.</summary>
    public string Text { get; set; }

    /// <summary>Close status sent by the peer, when MessageType is Close.</summary>
    public WebSocketCloseStatus? CloseStatus { get; set; }

    /// <summary>Close reason sent by the peer, when MessageType is Close.</summary>
    public string CloseStatusDescription { get; set; }

    /// <summary>
    /// True when the message exceeded the caller's size limit. The rest of the message was still
    /// read and discarded so the socket stays on a message boundary, and Text is left null.
    /// Callers should report it and carry on rather than closing the connection.
    /// </summary>
    public bool TooLarge { get; set; }

    /// <summary>Total payload bytes read, whether or not the message was kept.</summary>
    public long ByteCount { get; set; }
  }

  /// <summary>
  /// Reads whole messages off a WebSocket.
  /// <para>
  /// Use this instead of calling ReceiveAsync directly: ReceiveAsync fills at most
  /// <paramref name="chunkSize"/> bytes per call regardless of how the sender framed the message,
  /// so treating one ReceiveAsync result as one message silently truncates anything bigger and
  /// hands a partial JSON fragment to the parser.
  /// </para>
  /// </summary>
  public static class WebSocketMessageReader
  {
    /// <summary>Bytes requested per ReceiveAsync call. A chunk size only, not a message limit.</summary>
    public const int DefaultChunkSize = 8192;

    /// <summary>Default cap on one reassembled message, to bound memory if a peer misbehaves.</summary>
    public const int DefaultMaxMessageBytes = 64 * 1024 * 1024;

    /// <summary>
    /// Receives one complete message, reading as many chunks as it takes to reach EndOfMessage.
    /// </summary>
    /// <param name="socket">An open WebSocket.</param>
    /// <param name="cancelToken">Cancels the pending receive.</param>
    /// <param name="maxMessageBytes">
    /// Largest message to buffer. A larger one is drained and flagged via
    /// <see cref="WebSocketMessage.TooLarge"/> instead of being returned.
    /// </param>
    /// <param name="chunkSize">Bytes requested per underlying ReceiveAsync call.</param>
    public static async Task<WebSocketMessage> ReceiveMessageAsync(
        WebSocket socket,
        CancellationToken cancelToken,
        int maxMessageBytes = DefaultMaxMessageBytes,
        int chunkSize = DefaultChunkSize)
    {
      if (socket == null)
        throw new ArgumentNullException(nameof(socket));
      if (maxMessageBytes < 1)
        throw new ArgumentOutOfRangeException(nameof(maxMessageBytes));
      if (chunkSize < 1)
        throw new ArgumentOutOfRangeException(nameof(chunkSize));

      byte[] chunk = new byte[chunkSize];
      WebSocketMessage msg = new WebSocketMessage();

      using (MemoryStream payload = new MemoryStream())
      {
        bool overLimit = false;

        while (true)
        {
          WebSocketReceiveResult result = await socket
              .ReceiveAsync(new ArraySegment<byte>(chunk), cancelToken)
              .ConfigureAwait(false);

          // A close can arrive part way through a message; drop the partial payload.
          if (result.MessageType == WebSocketMessageType.Close)
          {
            msg.MessageType = WebSocketMessageType.Close;
            msg.CloseStatus = result.CloseStatus;
            msg.CloseStatusDescription = result.CloseStatusDescription;
            return msg;
          }

          msg.MessageType = result.MessageType;
          msg.ByteCount += result.Count;

          // Once over the limit keep reading but stop buffering, so the remaining chunks of this
          // message are consumed and the next call starts cleanly on the following message.
          if (overLimit || msg.ByteCount > maxMessageBytes)
            overLimit = true;
          else
            payload.Write(chunk, 0, result.Count);

          if (result.EndOfMessage)
            break;
        }

        if (overLimit)
        {
          msg.TooLarge = true;
          return msg;
        }

        if (msg.MessageType == WebSocketMessageType.Text)
        {
          // Decode once over the whole payload. A multi-byte UTF-8 character can straddle a chunk
          // boundary, so decoding chunk by chunk would corrupt it even after reassembly.
          msg.Text = Encoding.UTF8.GetString(payload.GetBuffer(), 0, (int)payload.Length);
        }

        return msg;
      }
    }
  }
}
