// @ts-check
/// <reference path="../pb_data/types.d.ts" />

routerAdd('GET', '/api/categorie-objets', (e) => {
  const categoriesObjetRecords = $app.findAllRecords("categories_objet")
  $app.expandRecords(categoriesObjetRecords, ['objets'], 
    // @ts-ignore
    null
  );

  const categoriesObjet = categoriesObjetRecords
    .map(categorieObjetRecord => {
      const nom = categorieObjetRecord?.get('nom')
      const objets = categorieObjetRecord?.expandedAll('objets').map(o => {
        return {nom: o?.get('nom')}
      })
      return {nom, objets}
    })

  return e.json(200, {
    data: categoriesObjet,
  });
});