"use client";

export function HoverLetters({
  text,
  activeColor = "hover:text-primary",
}: {
  text: string;
  activeColor?: string;
}) {
  return (
    <>
      {text.split("").map((letter, i) => (
        <span
          key={i}
          className={`inline-block transition-[transform,color,filter] duration-200 cursor-default ${
            letter === " "
              ? "w-[0.25em]"
              : `${activeColor} hover:-translate-y-[2px] hover:scale-110`
          }`}
        >
          {letter === " " ? " " : letter}
        </span>
      ))}
    </>
  );
}
