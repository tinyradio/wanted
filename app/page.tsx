import Calculator from "@/components/calculator";
import Iridescence from "@/components/iridescence";

export default function Home() {
  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 bg-black">
      <div className="absolute inset-0">
        <Iridescence
          color={[0.3, 0.5, 1.0]}
          speed={1.2}
          amplitude={0.1}
          mouseReact={true}
        />
      </div>
      <div className="relative z-10">
        <Calculator />
      </div>
    </div>
  );
}
