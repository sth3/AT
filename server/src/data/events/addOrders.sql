INSERT INTO [dbo].[ORDERS]
([no]
,[id]
,[name]
,[customerName]
,[dueDate]
,[recipeNo]
,[operatorId]
,[operatorName]
,[quantity]
,[idMixer]
,[mixingTime]
,[idPackingMachine]
,[createdAt]
,[lastUpdate]
,[completedAt]
)
VALUES
(
   @no
   , @id
   , @name
   , @customerName
   , @dueDate
   , @recipeNo
   , @operatorId
   , @operatorName
   , @quantity
   , @idMixer
   , @mixingTime
   , @idPackingMachine
   , GetDate()
   , GetDate()
   , '2022-10-12'
);

