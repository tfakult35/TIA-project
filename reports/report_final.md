# Info o projekte:
- Meno a priezvisko: Jakub Tarhovicky
- Názov projektu: NotesHare
- Link na repozitár:                  <!-- Link na Váš GitHub repozitár -->
- Link na verejnú inštanciu projektu: <!-- Link na verejný hosting, kde je Váš projekt dostupný -->

# Info o reportovanej verzii:
- Tag: final    <!-- Uviesť final_cisloSubverzie, ak ste robili vo finálnej verzii zmeny pred termínom odovzdania -->

# Info k testovaniu:     
<!-- Uveďte credentials testovacích používateľov, ak sú potrebné na otestovanie Vášho projektu. Uveďte aj akékoľvek iné relevantné informácie k testovaniu. Tieto informácie môžete alternatívne poslať aj e-mailom spolu s odovzdaním finálnej verzie (napr. ak nechcete testovacie credentials zverejňovať). -->
Existujúce účty:
username: Alice, password:heslo
username: Bob, password:heslo

# Postup, ako rozbehať vývojové prostredie 
<!-- Postup pre lokálne rozbehanie vývojového prostredia (kto si trúfa, kľudne ako Docker file / Docker compose) -->
1. Naklonujte si repozitar
2. V postgrese urobte tabulku
3. V tia-be si urobte .env subor s obsahom (premenne db si doplnte):
    JWT_SECRET=jalks33j121flkja7sf#5as#
    DB_USER=
    DB_PASSWORD=
    DB_HOST=
    DB_PORT=
    DB_NAME=
4. Spuste v priecinkoch tia-fe a tia-be npm install
5. Spuste v oboch prikaz npm run dev

# Stav implementácie:
<!-- V bodoch spísať, ktoré funcionality sú už implementované, rozpracované, neimplementované vôbec -->
Zo špecifikácie som z implementácie vynechal:
- group description
- tagy pre fily
- topic pre fily
- možnosť viacerých group pre jeden file
# Retrospektíva:
<!-- Keby ste to robili znovu, čo by ste urobili inak? -->
- Celkovo by som na vec išiel viac systematicky, väčšinou som veci robil zabehu: napr. pomenovanie premenných/routov, rendering, css design, errory, logické rozdelenie funkcií a routov v priečinkoch atď. 

<!-- Ste hrdý na výsledky svojej práce? Ktorý aspekt projektu je podľa Vás najviac kvalitný? -->

- Najlepšia časť môjho projektu je asi frontend pre manipulaciu a zobrazovanie súborov a jeho integrácia s backendom.


