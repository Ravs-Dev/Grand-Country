QB = {}

-- Grand Country Roleplay: empat pilihan spawn, termasuk lokasi terakhir.
QB.Spawns = {
    airport = {
        coords = vector4(-1036.77, -2741.91, 20.17, 335.79),
        location = 'airport',
        label = 'Airport',
    },
    sandy = {
        coords = vector4(1853.16, 3686.67, 34.27, 210.0),
        location = 'sandy',
        label = 'Sandy Shores',
    },
    last = {
        -- Nilai ini adalah fallback untuk karakter baru yang belum punya posisi tersimpan.
        coords = vector4(-1036.77, -2741.91, 20.17, 335.79),
        location = 'last',
        label = 'Last Location',
    },
    paleto = {
        coords = vector4(80.35, 6424.12, 31.67, 45.5),
        location = 'paleto',
        label = 'Paleto Bay',
    },
}
