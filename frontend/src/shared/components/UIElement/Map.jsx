import React, { useRef, useEffect } from 'react';

import './Map.css';

const Map = (props) => {
  const mapRef = useRef();

  const { center, zoom } = props;

  // JSX 처리 후 실행 -> Ref 연결 후 실행해서 에러 발생 X
  useEffect(() => {
    const map = new window.google.maps.Map(mapRef.current, {
      center: center,
      zoom: zoom,
    });

    // 마커 표시
    new window.google.maps.Marker({ position: props.center, map: map });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center, zoom]);

  return (
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
    ></div>
  );
};

export default Map;
