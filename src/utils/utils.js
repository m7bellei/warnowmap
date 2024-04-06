// src/utils/utils.js

// Verifica se uma nação está envolvida em um conflito
const isNationInvolvedInConflict = (nationName, conflict) => {
  return conflict.country_team1.includes(nationName) || conflict.country_team2.includes(nationName);
};

// Extrai nomes dos países envolvidos em um conflito, excluindo a nação em questão
const getOtherCountriesInvolved = (nationName, conflict) => {
  // Combina as equipes e filtra para remover a nação em questão
  return [...conflict.country_team1, ...conflict.country_team2].filter(name => name !== nationName);
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

// Atualiza o status da nação com base na presença de guerras ou tensões
const updateNationStatus = (nation, wars, tensions) => {
  if (wars.length > 0) {
    return "War";
  } else if (tensions.length > 0) {
    return "Tension";
  } else {
    return "Peace";
  }
};

// Adiciona conflitos (guerras e tensões) a cada nação
export const enrichNationsWithConflicts = (nations, conflicts) => {
  return nations.map(nation => {
    const wars = findWarsForNation(nation.name, conflicts);
    const tensions = findTensionsForNation(nation.name, conflicts);
    const status = updateNationStatus(nation, wars, tensions);
    const war_countries = wars.flatMap(war => getOtherCountriesInvolved(nation.name, war));
    const tension_countries = tensions.flatMap(tension => getOtherCountriesInvolved(nation.name, tension));

    return {
      ...nation,
      status, // Atualizado com base na presença de guerras ou tensões
      current_wars: wars,
      current_tensions: tensions,
      current_war_countries: war_countries,
      current_tension_countries: tension_countries,
    };
  });
};

export const isConflictActiveToday = (conflict) => {
  return conflict.conflict_today === true;
};

export const formatNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
