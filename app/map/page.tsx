import dynamic from 'next/dynamic';
import CardMap from "@map/Map";

export default function MapPage() {
  return (
    <div className={'max-w-full max-h-full'}>
      <CardMap />
    </div>
  );
}