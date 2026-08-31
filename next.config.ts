import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // The dev overlay badge sits on top of the page and lands in every QA screenshot.
  devIndicators: false,

  /**
   * The two Figma-designed product pages used to live under `/product/`. The live site groups all
   * five Platform-menu pages under `/platform/`, so they moved — these keep the old URLs working
   * for anything already linking to them.
   */
  async redirects() {
    return [
      { source: '/product/command', destination: '/platform/recruitment-os', permanent: true },
      {
        source: '/product/talent-intelligence',
        destination: '/platform/talent-intelligence',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
