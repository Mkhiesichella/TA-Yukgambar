import { useEffect, useRef } from 'react';
import { drawTemplate } from '../lib/templates.js';

export default function TemplateThumb({ id, w = 300 }) {
  const ref = useRef();
  useEffect(() => {
    drawTemplate(ref.current.getContext('2d'), w, (w * 2) / 3, id);
  }, [id, w]);
  return <canvas ref={ref} width={w} height={(w * 2) / 3} className="thumb" />;
}
