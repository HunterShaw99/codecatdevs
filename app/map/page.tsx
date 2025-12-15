import dynamic from 'next/dynamic';
import CardMap from "@map/Map";

export default function MapPage() {
  return (
    <div>
      <h1>Map View</h1>
      <CardMap />
    </div>
  );
}