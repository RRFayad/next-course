import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <Link href="performance">Performance</Link>
      <Link href="reliability">Reliability</Link>
      <Link href="scale">Scale</Link>
      <div>Home Page</div>;
    </div>
  );
}
