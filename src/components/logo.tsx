import { Link } from "react-router-dom";

interface LogoProps {
  /** "light" = for use on light backgrounds (dark navy text); "dark" = for use on dark/coloured backgrounds (white text). */
  variant?: "light" | "dark";
  /** "row" = icon left, text right (navbar/footer/login panels); "column" = icon on top, text centered below (sidebars). */
  layout?: "row" | "column";
  iconSize?: number;
  showTagline?: boolean;
  /** Pass `false` to render a non-interactive mark instead of a link to home. */
  linkTo?: string | false;
  className?: string;
}

export function Logo({
  variant = "light",
  layout = "row",
  iconSize = 44,
  showTagline = true,
  linkTo = "/",
  className = "",
}: LogoProps) {
  const textColor = variant === "dark" ? "#ffffff" : "#1a1a2e";
  const taglineColor = variant === "dark" ? "rgba(255,255,255,0.65)" : "#FF385C";

  const content = (
    <div
      className={`flex ${layout === "column" ? "flex-col items-center text-center gap-1.5" : "items-center gap-2.5"} ${className}`}
    >
      <img
        src="/images/home/sklps-icon.svg"
        alt="SKLPS"
        style={{ height: iconSize, width: "auto" }}
        className="shrink-0"
      />
      <div className={`flex flex-col leading-none ${layout === "column" ? "items-center" : ""}`}>
        <span className="text-[19px] font-extrabold tracking-tight" style={{ color: textColor }}>
          SKLPS
        </span>
        {showTagline && (
          <span
            className="text-[9px] font-semibold tracking-[0.14em] uppercase mt-1"
            style={{ color: taglineColor }}
          >
            Shree Kutch Leva Patel Samaj
          </span>
        )}
      </div>
    </div>
  );

  if (linkTo === false) return content;
  return (
    <Link to={linkTo} className="inline-flex">
      {content}
    </Link>
  );
}
