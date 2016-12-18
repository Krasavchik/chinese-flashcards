#install.packages("rpart")
#install.packages("rattle")

dat <- read.csv( "./../data/flashcardsdata.csv" ,
    sep = "," ,
    header = FALSE
)

colnames( dat ) <- c( "last_try" , "target" , "word" , "word_drawn" , "last_drawn" , "drawn_before_this" , "type" , "hash" )
