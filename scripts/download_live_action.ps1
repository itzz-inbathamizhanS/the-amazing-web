$images = @(
  @{ id = 'peter-parker-tobey'; url = 'https://upload.wikimedia.org/wikipedia/en/b/bf/Tobey_Maguire_as_Spider-Man.jpg'; ext = 'jpg' },
  @{ id = 'peter-parker-andrew'; url = 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Andrew_Garfield_by_Gage_Skidmore_%28cropped%29.jpg'; ext = 'jpg' },
  @{ id = 'peter-parker-tom'; url = 'https://upload.wikimedia.org/wikipedia/commons/0/03/Tom_Holland_%2828652884235%29_%28cropped%29.jpg'; ext = 'jpg' },
  @{ id = 'mary-jane-watson-raimi'; url = 'https://upload.wikimedia.org/wikipedia/commons/4/41/Kirsten_Dunst_Cannes_2016_3.jpg'; ext = 'jpg' },
  @{ id = 'green-goblin-raimi'; url = 'https://upload.wikimedia.org/wikipedia/en/e/e1/Green_Goblin_%28Willem_Dafoe%29.png'; ext = 'png' },
  @{ id = 'doc-ock-raimi'; url = 'https://upload.wikimedia.org/wikipedia/en/2/23/Doctor_Octopus_%28Alfred_Molina%29.png'; ext = 'png' },
  @{ id = 'gwen-stacy-webb'; url = 'https://upload.wikimedia.org/wikipedia/commons/0/05/Emma_Stone_at_the_30th_Annual_Producers_Guild_Awards_%28cropped%29.jpg'; ext = 'jpg' },
  @{ id = 'lizard-webb'; url = 'https://upload.wikimedia.org/wikipedia/en/e/e0/Lizard_%28The_Amazing_Spider-Man%29.png'; ext = 'png' },
  @{ id = 'electro-webb'; url = 'https://upload.wikimedia.org/wikipedia/en/1/10/Electro_%28Jamie_Foxx%29.png'; ext = 'png' },
  @{ id = 'mj-mcu'; url = 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Zendaya_at_the_2019_MTV_Movie_and_TV_Awards.jpg'; ext = 'jpg' },
  @{ id = 'vulture-mcu'; url = 'https://upload.wikimedia.org/wikipedia/en/6/65/Vulture_%28Michael_Keaton%29.png'; ext = 'png' },
  @{ id = 'mysterio-mcu'; url = 'https://upload.wikimedia.org/wikipedia/en/7/77/Mysterio_%28Jake_Gyllenhaal%29.png'; ext = 'png' }
)

New-Item -ItemType Directory -Force -Path "d:\Spider\temp_images"

foreach ($img in $images) {
    $out = "d:\Spider\temp_images\$($img.id).$($img.ext)"
    Write-Host "Downloading $($img.id)..."
    try {
        Invoke-WebRequest -Uri $img.url -OutFile $out -UseBasicParsing
        Write-Host "Saved $($img.id)"
    } catch {
        Write-Host "Failed $($img.id): $_"
    }
}
