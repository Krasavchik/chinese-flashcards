library(rpart)
library(RGtk2)
library(rattle)
library(rpart.plot)
library(RColorBrewer)
library(ROCR)

n <- nrow( dat )
shuffled_dat <- dat[ sample(n) , ]
train_indices <- 1:round(0.7 * n)
train <- shuffled_dat[ train_indices , ]
test_indices <- (round(0.7 * n) + 1):n
test <- shuffled_dat[test_indices, ]

tree <- rpart( target ~ last_try + last_drawn + word_drawn + drawn_before_this + type , train , method = "class")

# use model on test_dataset
pred <- predict(tree, test , type = 'class')
# confusion matrix
conf <- table(test$target, pred)
# accuracy of tree matrix
acc <- sum(diag(conf)) / sum(conf)

# Build the ROC Curve
probs <- predict(tree, test, type = "prob")[,2]
pred <- prediction(probs, test$target)
perf <- performance(pred,"tpr","fpr")
auc <- performance(pred, "auc")

par(mfrow = c(1, 2))
fancyRpartPlot(tree)
plot(perf)
