import os

pages = [
    'PlayHub', 'DailyPuzzlePage', 'VariantsHub', 'LearnHub', 'LobbyPage',
    'LeaderboardsPage', 'ProfilePage', 'LoginPage', 'RegisterPage', 'GuestPage',
    'SolitairePage', 'ZenMahjonggPage', 'TimeAttackPage', 'MahjongConnectPage',
    'ShisenShoPage', 'MahjonggMemoryPage', 'RealMahjongPage', 'PrivacyPage', 'TermsPage'
]

variants_pages = [
    'HongKongPage', 'RiichiPage', 'MCRPage', 'AmericanPage', 'TaiwanesePage'
]

learn_pages = [
    'MahjongVsMahjongg', 'HowToPlaySolitaire', 'HowToPlayRealMahjong',
    'ChiPungKong', 'BeginnerStrategy', 'MahjongVariantsGuide'
]

base_dir = 'src/app/pages'

os.makedirs(f'{base_dir}/variants', exist_ok=True)
os.makedirs(f'{base_dir}/learn', exist_ok=True)

template = """export default function {name}() {{
  return (
    <div className="container-wide py-24">
      <h1 className="font-display text-4xl text-gold mb-6">{name}</h1>
      <p className="text-ivory">This page is under construction.</p>
    </div>
  );
}}
"""

for p in pages:
    path = f'{base_dir}/{p}.tsx'
    if not os.path.exists(path):
        with open(path, 'w') as f:
            f.write(template.format(name=p))

for p in variants_pages:
    path = f'{base_dir}/variants/{p}.tsx'
    if not os.path.exists(path):
        with open(path, 'w') as f:
            f.write(template.format(name=p))

for p in learn_pages:
    path = f'{base_dir}/learn/{p}.tsx'
    if not os.path.exists(path):
        with open(path, 'w') as f:
            f.write(template.format(name=p))
