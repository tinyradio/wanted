import Calculator from "@/components/calculator";

export default function Home() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat p-4"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1561835503-648c2f1169d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920')",
      }}
    >
      <Calculator />
    </div>
  );
}
