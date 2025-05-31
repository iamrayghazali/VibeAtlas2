import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

const User = sequelize.define('User', {
    uid: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING },
    display_name: { type: DataTypes.STRING },
    created_at: { type: DataTypes.DATE }
}, {
    tableName: 'users',
    createdAt: 'created_at',
    timestamps: false
});

const SurveyQuestion = sequelize.define('SurveyQuestion', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    question_text: { type: DataTypes.STRING, allowNull: false }
}, {
    tableName: 'survey_questions',
    timestamps: false
});

const SurveyOption = sequelize.define('SurveyOption', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    question_id: { type: DataTypes.INTEGER, allowNull: false },
    option_text: { type: DataTypes.STRING, allowNull: false }
}, {
    tableName: 'survey_options',
    timestamps: false
});

const SurveyResponse = sequelize.define('SurveyResponse', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
}, {
    tableName: 'survey_responses',
    timestamps: false
});

const SearchHistory = sequelize.define('SearchHistory', {
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    country: { type: DataTypes.STRING, allowNull: false },
    city: { type: DataTypes.STRING, allowNull: false },
    searched_at: { type: DataTypes.DATE, allowNull: false }
}, {
    tableName: 'search_history',
    timestamps: false
});

// Define associations
function initializeAssociations() {
    SurveyQuestion.hasMany(SurveyOption, {
        foreignKey: 'question_id',
        as: 'options'
    });

    SurveyOption.belongsTo(SurveyQuestion, {
        foreignKey: 'question_id',
        as: 'question'
    });

    SurveyResponse.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user'
    });

    SurveyResponse.belongsTo(SurveyQuestion, {
        foreignKey: 'question_id',
        as: 'question'
    });

    SurveyResponse.belongsTo(SurveyOption, {
        foreignKey: 'option_id',
        as: 'option'
    });

    SearchHistory.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user'
    });
}

export {
    sequelize,
    User,
    SurveyQuestion,
    SurveyOption,
    SurveyResponse,
    SearchHistory,
    initializeAssociations
};