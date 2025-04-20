# Info o projekte:
- Meno a priezvisko: Jakub Tarhovický
- Názov projektu: Notes writing and sharing WebApp
- Link na repozitár: https://github.com/tfakult35/TIA-project

# Info o reportovanej verzii:  
- Tag: week9                   
- Obdobie: 9. týždeň, 13.4.2025 - 20.4.2025

# Plán:
Backend 
- create FileNoteTree, getovanie súborov (own, group, iných použivaťelov)
- access control - kontrolovať relatívne privilégia uživateľov na čítanie súborov - groupy, friendship

Frontend
- prepojiť file note tree na backend
- upraviť už exitujúce file note tree funkcie, cieľom je rozumná abstrakcia vo frontende
- rozhranie pre manipulovanie súborov a účtu
- group views
- css design

# Vykonaná práca:

- Registrácia 1fd70f4970e2398ad2e941e3684f053cf2bc2bbb
- Fetch obsahu súborov a fetch hlavičiek súborov z databázy do FE (createFileNoteTree) (aj access control) 04abae38157ac4052b4832cb6667096147130144
- Create new file funkcia b839670e14b752abcea4798de81790d4bc93ee5c
- Refractor FE pre účely vhodného renderingu 7fcabdcfabbb450addee2136b350918fed55cdb6
- Pridaná funkcia uloženia obsahu súbora do databázy z FE 444b3ee42403c20cf036aaec15d73eb2f9be7c3c 
- Načatie share funkcionality 3f99200e92b8a740d0f4ab671d3e20f1019f3d54

# Zdôvodnenie rozdielov medzi plánom a vykonanou prácou:

# Plán na ďalší týždeň:
Dokončiť beta verziu
- pridať možnosti manipulácie súborov (premenovať, delete, get info, pridať ako syna)
- social funkcionalitu
- groupy (neviem či toto už do bety stíham)
- hosting
atď.

# Problémy:
Žiadné.

# Zmeny v špecifikácii:
Žiadné.
 

