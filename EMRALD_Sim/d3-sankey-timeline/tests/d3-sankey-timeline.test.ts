/// <reference types="jest-extended" />
import SankeyTimeline from '../src/SankeyTimeline';
import TimelineLink from '../src/TimelineLink';
import TimelineNode from '../src/TimelineNode';

describe('SankeyTimeline', () => {
  test('createNode/createLink', () => {
    const timeline = new SankeyTimeline();
    const v0 = timeline.createNode('v0', { endTime: 2, startTime: 0 });
    expect(v0.label).toBe('v0');
    expect(v0.times.startTime).toBe(0);
    expect(v0.times.endTime).toBe(2);
    expect(v0.graph).toBe(timeline);
    expect(v0.id).toBe(0);
    const v1 = timeline.createNode('v1', { endTime: 4, startTime: 2 });
    const v2 = timeline.createNode('v2', { endTime: 8, startTime: 4 });
    const v3 = timeline.createNode('v3', { endTime: 5, startTime: 3 });
    const v4 = timeline.createNode('v4', {
      endTime: 12,
      meanTime: 8,
      startTime: 6,
      stdDeviation: 2,
    });
    expect(v4.times.meanTime).toBe(8);
    expect(v4.times.stdDeviation).toBe(2);
    timeline.createNode('v5', { endTime: 13, startTime: 11 });
    const a = timeline.createLink(v0, v1, 12);
    expect(a.source).toBe(v0);
    expect(a.target).toBe(v1);
    expect(a.flow).toBe(12);
    expect(v0.outgoingLinks.length).toBe(1);
    expect(v1.incomingLinks.length).toBe(1);
    timeline.createLink(v1, v2, 10);
    expect(v1.outgoingLinks.length).toBe(1);
    expect(v2.incomingLinks.length).toBe(1);
    timeline.createLink(v1, v3, 30);
    expect(v1.outgoingLinks.length).toBe(2);
    expect(v3.incomingLinks.length).toBe(1);
    const d = timeline.createLink('v2', 'v4', 4);
    expect(d.source).toBe(v2);
    expect(d.target).toBe(v4);
    const e = timeline.createLink(3, 2, 1);
    expect(e.source).toBe(v3);
    expect(e.target).toBe(v2);
    const f = timeline.createLink(v4, v0);
    expect(f.flow).toBe(0);
  });

  test('max values', () => {
    const timeline = new SankeyTimeline();
    expect(timeline.minTime).toBe(0);
    expect(timeline.maxTime).toBe(0);
    expect(timeline.maxSize).toBe(0);
    expect(timeline.maxFlow).toBe(0);
    const v0 = timeline.createNode('v0', { endTime: 2, startTime: 1 });
    const v1 = timeline.createNode('v1', { endTime: 4, startTime: 2 });
    const v2 = timeline.createNode('v2', { endTime: 8, startTime: 4 });
    const v3 = timeline.createNode('v3', { endTime: 5, startTime: 3 });
    const v4 = timeline.createNode('v4', { endTime: 12, startTime: 6 });
    const v5 = timeline.createNode('v5', { endTime: 13, startTime: 11 });
    expect(timeline.minTime).toBe(1);
    expect(timeline.maxTime).toBe(13);
    timeline.createLink(v0, v1, 12);
    timeline.createLink(v1, v2, 10);
    timeline.createLink(v1, v3, 30);
    timeline.createLink(v2, v4, 4);
    timeline.createLink(v3, v2, 1);
    timeline.createLink(v2, v5, 3);
    timeline.createLink(v5, v5, 2);
    timeline.createLink(v5, v3, 4);
    expect(timeline.maxSize).toBe(40);
    expect(timeline.maxFlow).toBe(30);
  });

  test('circuits', () => {
    const timeline = new SankeyTimeline();
    const v0 = timeline.createNode('v0', { endTime: 2, startTime: 1 });
    const v1 = timeline.createNode('v1', { endTime: 4, startTime: 2 });
    const v2 = timeline.createNode('v2', { endTime: 8, startTime: 4 });
    const v3 = timeline.createNode('v3', { endTime: 5, startTime: 3 });
    const v4 = timeline.createNode('v4', { endTime: 12, startTime: 6 });
    const v5 = timeline.createNode('v5', { endTime: 13, startTime: 11 });
    const a = timeline.createLink(v0, v1, 12);
    const b = timeline.createLink(v1, v2, 10);
    const c = timeline.createLink(v1, v3, 30);
    const d = timeline.createLink(v2, v4, 4);
    const e = timeline.createLink(v3, v2, 1);
    const f = timeline.createLink(v4, v0, 12);
    const g = timeline.createLink(v2, v5, 3);
    const h = timeline.createLink(v5, v5, 2);
    expect(a.isCircular).toBeFalse();
    expect(b.isCircular).toBeFalse();
    expect(c.isCircular).toBeFalse();
    expect(d.isCircular).toBeFalse();
    expect(e.isCircular).toBeFalse();
    expect(f.isCircular).toBeTrue();
    expect(g.isCircular).toBeFalse();
    expect(h.isCircular).toBeTrue();
  });
});

describe('TimelineLink', () => {
  const timeline = new SankeyTimeline();
  const v0 = new TimelineNode(timeline, 0, 'v0', { endTime: 2, startTime: 0 });
  const v1 = new TimelineNode(timeline, 1, 'v1', { endTime: 4, startTime: 2 });
  const v2 = new TimelineNode(timeline, 2, 'v2', { endTime: 8, startTime: 4 });
  const v3 = new TimelineNode(timeline, 3, 'v3', { endTime: 5, startTime: 3 });
  const v4 = new TimelineNode(timeline, 4, 'v4', { endTime: 12, startTime: 6 });
  const v5 = new TimelineNode(timeline, 5, 'v5', {
    endTime: 13,
    startTime: 11,
  });
  const a = new TimelineLink(timeline, 0, v0, v1, 12);
  const b = new TimelineLink(timeline, 1, v1, v2, 10);
  const c = new TimelineLink(timeline, 2, v1, v3, 30);
  const d = new TimelineLink(timeline, 3, v2, v4, 4);
  const e = new TimelineLink(timeline, 4, v3, v2, 1);
  const f = new TimelineLink(timeline, 5, v4, v0, 12);
  const g = new TimelineLink(timeline, 6, v2, v5, 3);
  const h = new TimelineLink(timeline, 7, v5, v5, 2);

  test('isSelfLinking', () => {
    expect(a.isSelfLinking).toBeFalse();
    expect(b.isSelfLinking).toBeFalse();
    expect(c.isSelfLinking).toBeFalse();
    expect(d.isSelfLinking).toBeFalse();
    expect(e.isSelfLinking).toBeFalse();
    expect(f.isSelfLinking).toBeFalse();
    expect(g.isSelfLinking).toBeFalse();
    expect(h.isSelfLinking).toBeTrue();
  });
});

describe('TimelineNode', () => {
  const timeline = new SankeyTimeline();
  const v0 = new TimelineNode(timeline, 0, 'v0', { endTime: 2, startTime: 0 });
  const v1 = new TimelineNode(timeline, 1, 'v1', { endTime: 4, startTime: 2 });
  const v2 = new TimelineNode(timeline, 2, 'v2', { endTime: 8, startTime: 4 });
  const v3 = new TimelineNode(timeline, 3, 'v3', { endTime: 5, startTime: 3 });
  const v4 = new TimelineNode(timeline, 4, 'v4', { endTime: 12, startTime: 6 });
  const v5 = new TimelineNode(timeline, 5, 'v5', {
    endTime: 13,
    startTime: 11,
  });
  timeline.createLink(v0, v1, 12);
  timeline.createLink(v1, v2, 10);
  timeline.createLink(v1, v3, 30);
  timeline.createLink(v2, v4, 4);
  timeline.createLink(v3, v2, 1);
  timeline.createLink(v2, v5, 3);
  timeline.createLink(v5, v5, 2);

  test('links', () => {
    expect(v0.links.length).toBe(1);
    expect(v1.links.length).toBe(3);
    expect(v2.links.length).toBe(4);
    expect(v3.links.length).toBe(2);
    expect(v4.links.length).toBe(1);
    expect(v5.links.length).toBe(3);
  });

  test('size', () => {
    expect(v0.size).toBe(12);
    expect(v1.size).toBe(40);
    expect(v2.size).toBe(11);
    expect(v3.size).toBe(30);
    expect(v4.size).toBe(4);
    expect(v5.size).toBe(5);
  });
});
