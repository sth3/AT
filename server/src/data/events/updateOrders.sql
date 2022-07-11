UPDATE  [dbo].[ORDERS]
SET     
[id]= @id 
,[name] = @name
,[customerName] = @customerName
,[dueDate] = @dueDate
,[recipeNo] = @recipeNo
,[operatorId] = @operatorId
,[operatorName] = @operatorName
,[quantity] = @quantity
,[idMixer] = @idMixer
,[mixingTime] = @mixingTime
,[idPackingMachine] = @idPackingMachine
,[lastUpdate] = GetDate()
    
WHERE   [no] = @no;

SELECT *
FROM	[dbo].[ORDERS]

