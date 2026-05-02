export default async function handler(req, res) {
    const { location, timesteps, units } = req.query;

    if (!location) {
        return res.status(400).json({ error: 'Missing location' });
    }

    const apiKey = process.env.TOMORROW_API_KEY;
    const url = `https://api.tomorrow.io/v4/weather/forecast?location=${encodeURIComponent(location)}&apikey=${apiKey}&timesteps=${timesteps || '1h,1d'}&units=${units || 'metric'}`;

    try {
        const upstream = await fetch(url);
        const data = await upstream.json();
        res.setHeader('Cache-Control', 's-maxage=3600'); // Vercel edge caches for 1 hour
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: 'Weather fetch failed' });
    }
}
