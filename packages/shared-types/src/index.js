"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scoreToGrade = scoreToGrade;
function scoreToGrade(score) {
    if (score >= 90)
        return 'A';
    if (score >= 75)
        return 'B';
    if (score >= 50)
        return 'C';
    if (score >= 25)
        return 'D';
    return 'F';
}
