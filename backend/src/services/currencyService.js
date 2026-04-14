// backend/src/services/currencyService.js
import axios from 'axios';

// Cache tỷ giá trong 1 giờ để tránh gọi API liên tục
let rateCache = {
    rate: null,
    lastFetched: null,
};

const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 giờ
const FALLBACK_RATE = 25000;               // fallback nếu API lỗi

let getUsdToVndRate = async () => {
    try {
        // Kiểm tra cache còn hạn không
        const now = Date.now();
        if (rateCache.rate && rateCache.lastFetched && (now - rateCache.lastFetched) < CACHE_DURATION_MS) {
            console.log(`[Currency] Using cached rate: 1 USD = ${rateCache.rate} VND`);
            return rateCache.rate;
        }

        // Gọi Frankfurter API — không cần key, miễn phí hoàn toàn
        const res = await axios.get('https://api.frankfurter.dev/v2/rate/USD/VND', {
            timeout: 5000
        });

        const rate = res?.data?.rate;
        if (!rate || isNaN(rate)) throw new Error('Invalid rate from API');

        // Lưu cache
        rateCache.rate = rate;
        rateCache.lastFetched = now;

        console.log(`[Currency] Fresh rate fetched: 1 USD = ${rate} VND`);
        return rate;

    } catch (e) {
        console.error('[Currency] API failed, using fallback rate:', e.message);
        return rateCache.rate || FALLBACK_RATE; // dùng cache cũ hoặc fallback
    }
};

// Convert USD → VNĐ, làm tròn đến nghìn
let convertUsdToVnd = async (usdAmount) => {
    const rate = await getUsdToVndRate();
    const vnd = Math.round(usdAmount * rate / 1000) * 1000; // làm tròn đến nghìn VNĐ
    return vnd;
};

module.exports = { getUsdToVndRate, convertUsdToVnd };