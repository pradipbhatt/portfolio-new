import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default async function Favicon() {
  try {
    // Fetch the latest GitHub profile picture
    const response = await fetch('https://github.com/pradipbhatt.png', {
      headers: {
        'User-Agent': 'Portfolio-Favicon',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch GitHub avatar');
    }

    const imageBuffer = await response.arrayBuffer();
    
    return new Response(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
      },
    });
  } catch {
    // Fallback to a simple colored square if GitHub fetch fails
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#C15928',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          P
        </div>
      ),
      {
        ...size,
      }
    );
  }
}
