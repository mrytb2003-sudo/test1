# Personalitatea brandurilor: prezentare individuală

Curs Brand Management, prof. Florin Nechita · 18.11.2026 · Alexandru Cosmin Jugănaru

## Fișiere
- `index.html`: prezentarea. Un singur fișier care merge **fără internet** (fonturile Archivo și Inter și GSAP sunt incluse). Deschide-l în Chrome.
- `Personalitatea_brandurilor_Juganaru.pdf`: copia de rezervă, toate slide-urile în starea finală.
- `SURSE.md`: fiecare afirmație de pe slide-uri și pagina din articol de unde vine.

## Taste
| Tasta | Ce face |
|---|---|
| → / Spațiu / click | animația următoare sau slide-ul următor |
| ← / click în marginea stângă | slide-ul anterior |
| **F** | ecran complet |
| **S** | mod prezentator: fereastră separată cu notele, timpul scurs, ținta de timp și slide-ul următor. Trage-o pe laptop, iar prezentarea pe proiector. |
| N | notele direct pe ecran, pentru repetiții |
| B | ecran negru |
| Home / End | primul / ultimul slide |
| cifră + Enter | sari la slide-ul respectiv |
| ? | ajutor |

Dacă browserul blochează fereastra prezentatorului, apasă „Permite pop-up-uri”, apoi din nou S.

## Jocul (slide-ul 8)
- **Săgețile** mișcă personajul, **Spațiu** deschide alegerea la felinarul apropiat, **← / →** alege „Caracter” sau „Altceva”, iar **Spațiu** confirmă.
- După toate cele 8 felinare, mergi în poarta-cerc din dreapta și jocul trece singur la recapitulare.
- **Esc** sau **PageDown** (butonul de clicker) sare peste joc oricând.
- Cât timp jocul e activ, click-ul pe ecran nu schimbă slide-ul.

## Modificări
Sursa e în `src/deck.html`. După orice modificare rulează:
```
python3 build.py        # refacere index.html
node export_pdf.js      # refacere PDF (necesită Playwright)
```
