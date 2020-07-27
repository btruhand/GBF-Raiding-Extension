class RaidBoss {

  level: Number
  engName: string
  jpnName: string

  constructor(level: Number, engName: string, jpnName: string) {
    this.level = level;
    this.engName = engName
    this.jpnName = jpnName
  }
}

const raids = {
  "high-level": [
    new RaidBoss(100, 'Tiamat Omega Ayr', 'ティアマト・マグナ＝エア'),
    new RaidBoss(100, 'Colossus Omega', 'コロッサス・マグナ'),
    new RaidBoss(100, 'Leviathan Omega', 'リヴァイアサン・マグナ'),
    new RaidBoss(100, 'Yggdrasil Omega', 'ユグドラシル・マグナ'),
    new RaidBoss(100, 'Luminiera Omega', 'シュヴァリエ・マグナ'),
    new RaidBoss(100, 'Celeste Omega', 'セレスト・マグナ'),
    new RaidBoss(120, 'Nezha', 'ナタク'),
    new RaidBoss(120, 'Twin Elements', 'フラム＝グラス'),
    new RaidBoss(120, 'Macula Marius', 'マキュラ・マリウス'),
    new RaidBoss(120, 'Medusa', 'メドゥーサ'),
    new RaidBoss(120, 'Apollo', 'アポロン'),
    new RaidBoss(120, 'Dark Angel Olivia', 'Dエンジェル・オリヴィエ'),
    new RaidBoss(110, 'Rose Queen', 'ローズクイーン'),
    new RaidBoss(120, 'Shiva', 'シヴァ'),
    new RaidBoss(120, 'Europa', 'エウロペ'),
    new RaidBoss(120, 'Godsworn Alexiel', 'ゴッドガード・ブローディア'),
    new RaidBoss(120, 'Grimnir', 'グリームニル'),
    new RaidBoss(120, 'Metatron', 'メタトロン'),
    new RaidBoss(120, 'Avatar', 'アバター'),
    new RaidBoss(120, 'Prometheus', 'プロメテウス'),
    new RaidBoss(120, 'Ca Ong', 'カー・オン'),
    new RaidBoss(120, 'Gilgamesh', 'ギルガメッシュ'),
    new RaidBoss(120, 'Morrigna', 'バイヴカハ'),
    new RaidBoss(120, 'Hector', 'ヘクトル'),
    new RaidBoss(120, 'Anubis', 'アヌビス'),
    new RaidBoss(150, 'Tiamat Malice', 'ティアマト・マリス'),
    new RaidBoss(150, 'Leviathan Malice', 'リヴァイアサン・マリス'),
    new RaidBoss(150, 'Phronesis', 'フロネシス'),
    new RaidBoss(150, 'Lucilius', 'ルシファー'),
    new RaidBoss(200, 'Lindwurm', 'リンドヴルム'),
    new RaidBoss(150, 'Proto Bahamut', 'プロトバハムート'),
    new RaidBoss(200, 'Akasha', 'アーカーシャ'),
    new RaidBoss(200, 'The Four Primarchs', '四大天司ＨＬ'),
    new RaidBoss(200, 'Grand Order', 'ジ・オーダー・グランデ'),
    new RaidBoss(200, 'Ultimate Bahamut', 'アルティメットバハムート'),
    new RaidBoss(250, 'Lucilius', 'ルシファー'),
    new RaidBoss(250, 'Beelzebub', 'ベルゼバブ')
  ]
}

export { raids }