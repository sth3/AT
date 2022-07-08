--   SELECT [RECIPE_H].[no], [RECIPE_H].[id], 
--        [RECIPE_H].[name], [RECIPE_H].[lastUpdate], 
--        COMPONENT.[NAME], [RECIPE_B].[componentSP]
-- 	FROM [RECIPE_H]
-- 	LEFT JOIN [RECIPE_B] 
-- 	ON [RECIPE_H].[no] = [RECIPE_B].[recipeNo] 
-- 	LEFT JOIN [COMPONENT] 
-- 	ON [RECIPE_B].[componentNo] = [COMPONENT].[No]

SELECT * FROM [AT].[dbo].[RECIPE_B]
