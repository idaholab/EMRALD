import { Box, Skeleton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

type Discussion = {
  title: string;
  body: string;
  state: 'open' | 'closed';
};

export const News: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(true);
  const [hasNews, setHasNews] = useState(false);
  const [title, setTitle] = useState<string>();
  const [body, setBody] = useState<string>();
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    const getLatestDiscussion = async () => {
      const discussion = (
        (await (
          await fetch(
            'https://api.github.com/repos/idaholab/emrald/discussions',
          )
        ).json()) as Discussion[]
      ).at(-1);
      if (discussion !== undefined && discussion.state === 'open') {
        setTitle(discussion.title);
        const body = discussion.body;
        const mdLink = /\[([^\]]+)\]\(([^)]+)\)/;
        if (mdLink.test(body)) {
          setBody(body.replace(mdLink, '$1'));
          setUrl(body.replace(mdLink, '$2'));
        } else {
          setBody(discussion.body);
        }
      } else {
        setVisible(false);
      }
      setLoading(false);
    };
    if (!hasNews) {
      setLoading(true);
      void getLatestDiscussion();
      setHasNews(true);
    }
  });

  return visible ? (
    <Box
      component="a"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        display: 'block',
        px: 2,
        py: 1.5,
        backgroundColor: '#1d6b4a',
        borderTop: '1px solid rgba(255,255,255,0.12)',
        textDecoration: 'none',
        transition: 'background-color 150ms cubic-bezier(0.22, 1, 0.36, 1)',
        '&:hover': { backgroundColor: '#175840' },
        '&:focus-visible': {
          outline: '2px solid #7dd4aa',
          outlineOffset: '-2px',
        },
      }}
    >
      <Typography
        sx={{
          display: 'block',
          color: 'rgba(255,255,255,0.5)',
          fontSize: '10px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          lineHeight: 1.2,
          mb: 0.5,
        }}
      >
        News
      </Typography>
      <Box
        sx={{
          display: 'block',
          color: '#fff',
          fontSize: '12px',
          lineHeight: 1.4,
          mb: 0.75,
          opacity: loading ? 0 : 1,
          transition: 'opacity 300ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {loading ? <Skeleton width="80%" /> : title}
        <br />
        {body}
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          color: '#7dd4aa',
          fontSize: '11px',
          lineHeight: 1.2,
          opacity: loading ? 0 : 1,
          transition: 'opacity 300ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {url === undefined ? (
          <></>
        ) : loading ? (
          <Box
            component="span"
            sx={{
              display: 'inline-flex',
              width: 10,
              height: 10,
              border: '2px solid rgba(125,212,170,0.3)',
              borderTopColor: '#7dd4aa',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              '@keyframes spin': { to: { transform: 'rotate(360deg)' } },
            }}
          />
        ) : (
          <span>{url.length < 40 ? url : `${url.slice(0, 37)}...`}</span>
        )}
        {!loading && url !== undefined && <span>↗</span>}
      </Box>
    </Box>
  ) : (
    <></>
  );
};
