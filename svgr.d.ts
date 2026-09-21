declare module "*.svg" {
  import type { FC, SVGProps } from "react";

  const content: FC<SVGProps<SVGSVGElement> & { title?: string }>;
  export default content;
}
