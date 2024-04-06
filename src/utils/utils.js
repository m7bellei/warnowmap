// src/utils/utils.js

// Verifica se uma nação está envolvida em um conflito
const isNationInvolvedInConflict = (nationName, conflict) => {
  return conflict.country_team1.includes(nationName) || conflict.country_team2.includes(nationName);
};

// Encontra guerras para uma nação específica
const findWarsForNation = (nationName, conflicts) => {
  return conflicts.filter(conflict => 
    isNationInvolvedInConflict(nationName, conflict) && conflict.type === "War"
  );
};

// Encontra tensões para uma nação específica
const findTensionsForNation = (nationName, conflicts) => {
  return conflicts.filter(conflict => 
    isNationInvolvedInConflict(nationName, conflict) && conflict.type === "Tension"
  );
};

// Adiciona conflitos (guerras e tensões) a cada nação
export const enrichNationsWithConflicts = (nations, conflicts) => {
  return nations.map(nation => ({
    ...nation,
    current_wars: findWarsForNation(nation.name, conflicts),
    current_tensions: findTensionsForNation(nation.name, conflicts)
  }));
};

export const formatNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
