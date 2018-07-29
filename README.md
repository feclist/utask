# µtask

µtask is an application that focusses on an individual making a small (micro) task for another individual. If this task is completed within a set timeframe and verified to be valid the individual who made the task gets a payment. This payment comes from the BT (Branded Token) funds the individual who made the micro task possesses. These micro tasks can be any arbitrary task, just create it in µtask and have individuals solve your tasks. This entire monetary ecosystem runs on OST.

## Task completion and reward
When a task is started a LiveTask instance is created to keep track of the active task. Once this LiveTask (or actual task) is completed a TaskReward instance is created and then bound ot the Task object under completions. This TaskReward instance contains the user who completed the task, the task this reward belongs to and the transaction id that belongs to the that instance of the conpleted task. This way all user-to-user transactions in µtask are bound to instances of completed tasks. This makes it easier for us and users to keep track of what transaction was the result of what task completion.