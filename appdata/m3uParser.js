// ═══════════════════════════════════════════════════════════════════════════
// m3uParser.js — محلل ملفات M3U وعارض القنوات التلقائي
// ═══════════════════════════════════════════════════════════════════════════
//
// الاستخدام:
// 1. ضع محتوى ملف M3U كاملاً في متغير RAW_M3U أدناه
// 2. سيتم تحليله تلقائياً وتنظيم القنوات في مجموعات
// 3. استخدم PARSED_GROUPS في ChannelsScreen
//
// ═══════════════════════════════════════════════════════════════════════════

// ─── ضع محتوى ملف M3U هنا ────────────────────────────────────────────────
export const RAW_M3U = `
#EXTM3U
#EXTINF:-1 tvg-id="MBC1" tvg-name="MBC 1" tvg-logo="https://www.mbc.net/content/dam/mbc/logo/MBC1-Logo.png" group-title="MBC Group",MBC 1
https://your-stream-url/mbc1/index.m3u8

#EXTINF:-1 tvg-id="MBC2" tvg-name="MBC 2" tvg-logo="https://www.mbc.net/content/dam/mbc/logo/MBC2-Logo.png" group-title="MBC Group",MBC 2
https://your-stream-url/mbc2/index.m3u8

#EXTINF:-1 tvg-id="MBC3" tvg-name="MBC 3" tvg-logo="https://www.mbc.net/content/dam/mbc/logo/MBC3-Logo.png" group-title="MBC Group",MBC 3
https://your-stream-url/mbc3/index.m3u8

#EXTINF:-1 tvg-id="MBCDrama" tvg-name="MBC Drama" tvg-logo="https://www.mbc.net/content/dam/mbc/logo/MBCDrama-Logo.png" group-title="MBC Group",MBC Drama
https://your-stream-url/mbcdrama/index.m3u8

#EXTINF:-1 tvg-id="beIN1" tvg-name="beIN Sports 1 HD" tvg-logo="https://pbs.twimg.com/profile_images/1488149649625423875/9JRJXYjy_400x400.jpg" group-title="beIN Sports",beIN Sports 1 HD
https://your-stream-url/bein1/index.m3u8

#EXTINF:-1 tvg-id="beIN2" tvg-name="beIN Sports 2 HD" tvg-logo="https://pbs.twimg.com/profile_images/1488149649625423875/9JRJXYjy_400x400.jpg" group-title="beIN Sports",beIN Sports 2 HD
https://your-stream-url/bein2/index.m3u8

#EXTINF:-1 tvg-id="beIN3" tvg-name="beIN Sports 3 HD" tvg-logo="https://pbs.twimg.com/profile_images/1488149649625423875/9JRJXYjy_400x400.jpg" group-title="beIN Sports",beIN Sports 3 HD
https://your-stream-url/bein3/index.m3u8

#EXTINF:-1 tvg-id="AlJazeera" tvg-name="Al Jazeera Arabic" tvg-logo="https://images.connecttv.ca/covers/al-jazeera-arabic/icon_show_aljazeera-arabic_20160922133400.jpg" group-title="News",Al Jazeera Arabic
https://live-hls-v3-aja.getaj.net/AJA/v3/index.m3u8

#EXTINF:-1 tvg-id="AlJazeeraEng" tvg-name="Al Jazeera English" tvg-logo="https://pbs.twimg.com/profile_images/1285854130278547459/jq59opz3_400x400.jpg" group-title="News",Al Jazeera English
https://live-hls-web-aje.getaj.net/AJE/index.m3u8

#EXTINF:-1 tvg-id="France24" tvg-name="France 24 Arabic" tvg-logo="https://pbs.twimg.com/profile_images/1231873146527383554/zZVVlmit_400x400.jpg" group-title="News",France 24 Arabic
https://f24hls-i.akamaihd.net/hls/live/221193/F24_AR_HI/master.m3u8

#EXTINF:-1 tvg-id="Makkah" tvg-name="Makkah TV" tvg-logo="https://i.ytimg.com/vi/4Dp3GxZjfnY/maxresdefault.jpg" group-title="Religious",Makkah TV
https://bin79.ott.cdn.net.sa:443/live/4000026/index.m3u8

#EXTINF:-1 tvg-id="Madinah" tvg-name="Madinah TV" tvg-logo="https://i.ytimg.com/vi/h1Lr7R7xAH0/maxresdefault.jpg" group-title="Religious",Madinah TV
https://bin79.ott.cdn.net.sa:443/live/4000027/index.m3u8
`;
// ─────────────────────────────────────────────────────────────────────────────

// ─── ألوان المجموعات التلقائية ────────────────────────────────────────────
const GROUP_COLORS = {
  'MBC Group':      { color:'#e63946', colors:['#1a1a2e','#e63946'], icon:'tv'          },
  'Rotana':         { color:'#d4af37', colors:['#0f0f0f','#d4af37'], icon:'musical-notes'},
  'beIN Sports':    { color:'#e63946', colors:['#0d1b2a','#e63946'], icon:'football'     },
  'OSN':            { color:'#7c3aed', colors:['#1a1a2e','#7c3aed'], icon:'film'         },
  'SSC':            { color:'#1565c0', colors:['#0d1b2a','#1565c0'], icon:'trophy'       },
  'Al Jazeera':     { color:'#d4a017', colors:['#0a1628','#d4a017'], icon:'globe'        },
  'Abu Dhabi':      { color:'#006400', colors:['#1a1a1a','#006400'], icon:'business'     },
  'Dubai':          { color:'#c9a84c', colors:['#1a1a1a','#c9a84c'], icon:'business'     },
  'News':           { color:'#3b82f6', colors:['#0d1b2a','#3b82f6'], icon:'newspaper'    },
  'Saudi':          { color:'#006400', colors:['#006400','#ffffff'], icon:'flag'         },
  'Religious':      { color:'#10b981', colors:['#006400','#d4af37'], icon:'moon'         },
  'Kids':           { color:'#ff6b6b', colors:['#ff6b6b','#ffd93d'], icon:'happy'        },
  'Egypt':          { color:'#c8a84b', colors:['#0a5c36','#c8a84b'], icon:'tv'           },
  'Gulf':           { color:'#d4af37', colors:['#1a1a1a','#d4af37'], icon:'flag'         },
  'Sports':         { color:'#e63946', colors:['#0d1b2a','#e63946'], icon:'football'     },
  'Music':          { color:'#ff69b4', colors:['#1a1a1a','#ff69b4'], icon:'musical-notes'},
  'Movies':         { color:'#d4af37', colors:['#0f0f0f','#d4af37'], icon:'film'         },
  'Documentary':    { color:'#2ecc71', colors:['#1a1a1a','#2ecc71'], icon:'book'         },
  'Lebanese':       { color:'#e63946', colors:['#1a1a1a','#e63946'], icon:'tv'           },
  'Syrian':         { color:'#c8a84b', colors:['#1a1a1a','#c8a84b'], icon:'tv'           },
  'Iraqi':          { color:'#c8a84b', colors:['#1a1a1a','#c8a84b'], icon:'tv'           },
  'Maghreb':        { color:'#e63946', colors:['#1a1a1a','#e63946'], icon:'tv'           },
  'Turkish':        { color:'#e63946', colors:['#e63946','#ffffff'], icon:'tv'           },
  'Indian':         { color:'#ff6600', colors:['#ff6b6b','#ffd93d'], icon:'film'         },
  'International':  { color:'#3b82f6', colors:['#0d1b2a','#3b82f6'], icon:'globe'        },
  'DEFAULT':        { color:'#7c3aed', colors:['#1a0533','#7c3aed'], icon:'tv'           },
};

// ─── الحصول على ألوان المجموعة ────────────────────────────────────────────
function getGroupStyle(groupName) {
  const name = groupName || '';
  for (const [key, val] of Object.entries(GROUP_COLORS)) {
    if (key === 'DEFAULT') continue;
    if (name.toLowerCase().includes(key.toLowerCase())) return val;
  }
  return GROUP_COLORS['DEFAULT'];
}

// ─── تحليل ملف M3U ────────────────────────────────────────────────────────
export function parseM3U(m3uText) {
  const lines    = m3uText.split('\n').map(l => l.trim()).filter(Boolean);
  const channels = [];
  let current    = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('#EXTINF:')) {
      // استخراج البيانات من السطر
      const nameMatch  = line.match(/,(.+)$/);
      const logoMatch  = line.match(/tvg-logo="([^"]*)"/);
      const groupMatch = line.match(/group-title="([^"]*)"/);
      const idMatch    = line.match(/tvg-id="([^"]*)"/);
      const tvgName    = line.match(/tvg-name="([^"]*)"/);

      current = {
        id:         idMatch?.[1]   || `ch_${i}`,
        name:       nameMatch?.[1]?.trim() || tvgName?.[1] || 'قناة غير معروفة',
        image:      logoMatch?.[1] || '',
        group:      groupMatch?.[1] || 'Other',
        streamUrl:  '',
        colors:     getGroupStyle(groupMatch?.[1]).colors,
        isLive:     true,
      };
    } else if (line.startsWith('http') && current) {
      current.streamUrl = line;
      channels.push(current);
      current = null;
    }
  }

  return channels;
}

// ─── تجميع القنوات في مجموعات ─────────────────────────────────────────────
export function groupChannels(channels) {
  const map = {};

  channels.forEach(ch => {
    const g = ch.group || 'Other';
    if (!map[g]) map[g] = [];
    map[g].push(ch);
  });

  return Object.entries(map)
    .sort((a, b) => b[1].length - a[1].length) // ترتيب حسب عدد القنوات
    .map(([name, chs], idx) => {
      const style = getGroupStyle(name);
      // أول صورة من القنوات كصورة للمجموعة
      const cover = chs.find(c => c.image)?.image || '';
      return {
        id:      `group_${idx}_${name.replace(/\s/g, '_')}`,
        nameAr:  name,
        nameEn:  name,
        icon:    style.icon,
        color:   style.color,
        colors:  style.colors,
        image:   cover,
        channels: chs.map((c, i) => ({
          id:        `${c.id}_${i}`,
          name:      c.name,
          image:     c.image,
          colors:    c.colors,
          streamUrl: c.streamUrl,
        })),
      };
    });
}

// ─── التحليل الجاهز للاستخدام ─────────────────────────────────────────────
export const PARSED_CHANNELS = parseM3U(RAW_M3U);
export const PARSED_GROUPS   = groupChannels(PARSED_CHANNELS);

// ─── إحصاءات ─────────────────────────────────────────────────────────────
export const M3U_STATS = {
  totalChannels: PARSED_CHANNELS.length,
  totalGroups:   PARSED_GROUPS.length,
  workingStreams: PARSED_CHANNELS.filter(c => c.streamUrl).length,
};