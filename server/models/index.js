const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

// Define models without associations

const User = sequelize.define('User', {
    uid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
    },
    display_name: {
        type: DataTypes.STRING,
    },
    created_at: {
        type: DataTypes.DATE,
    }
}, {
    tableName: 'users',  // Explicit table name
    createdAt: 'created_at',  // Map Sequelize's createdAt to your column
    timestamps: false  // Disable timestamps
});

const SurveyQuestion = sequelize.define('SurveyQuestion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    question_text: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'survey_questions',
    timestamps: false  // Disable timestamps
});

const SurveyOption = sequelize.define('SurveyOption', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    question_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    option_text: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'survey_options',  // Explicit table name
    timestamps: false  // Disable timestamps
});

const SurveyResponse = sequelize.define('SurveyResponse', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
}, {
    tableName: 'survey_responses',
    timestamps: false  // Disable timestamps
});

const SearchHistory = sequelize.define('SearchHistory', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    searched_at: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'search_history',  // Explicit table name
    timestamps: false  // Disable timestamps
});

// Define associations in a function
function initializeAssociations() {
    // SurveyQuestion to SurveyOption
    SurveyQuestion.hasMany(SurveyOption, {
        foreignKey: 'question_id',
        as: 'options'
    });

    SurveyOption.belongsTo(SurveyQuestion, {
        foreignKey: 'question_id',
        as: 'question'
    });

    // SurveyResponse associations
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

    // Add association for SearchHistory
    SearchHistory.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user'
    });
}

module.exports = {
    sequelize,
    User,
    SurveyQuestion,
    SurveyOption,
    SurveyResponse,
    SearchHistory,  // Export SearchHistory model
    initializeAssociations
};