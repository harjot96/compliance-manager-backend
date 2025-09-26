// Plug and Play Xero Settings Model
// Database model for storing Xero integration settings and tokens
// This model handles secure storage of sensitive Xero data

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PlugAndPlayXeroSettings = sequelize.define('PlugAndPlayXeroSettings', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'companies',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    clientId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Xero app client ID'
    },
    clientSecret: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Encrypted Xero app client secret'
    },
    redirectUri: {
      type: DataTypes.STRING(500),
      allowNull: false,
      comment: 'OAuth redirect URI'
    },
    accessToken: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Encrypted Xero access token'
    },
    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Encrypted Xero refresh token'
    },
    tokenExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Access token expiration time'
    },
    tenants: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Available Xero organizations/tenants'
    },
    lastSyncAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Last successful data sync'
    },
    syncStatus: {
      type: DataTypes.ENUM('active', 'paused', 'error', 'never_synced'),
      allowNull: false,
      defaultValue: 'never_synced',
      comment: 'Current sync status'
    },
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Last error message if sync failed'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Whether integration is active'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'plug_and_play_xero_settings',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['companyId'],
        name: 'unique_company_xero_settings'
      },
      {
        fields: ['clientId'],
        name: 'idx_xero_client_id'
      },
      {
        fields: ['isActive'],
        name: 'idx_xero_active'
      },
      {
        fields: ['syncStatus'],
        name: 'idx_xero_sync_status'
      },
      {
        fields: ['createdAt'],
        name: 'idx_xero_created_at'
      }
    ],
    hooks: {
      beforeUpdate: (instance) => {
        instance.updatedAt = new Date();
      }
    }
  });

  // Instance methods
  PlugAndPlayXeroSettings.prototype.isTokenExpired = function() {
    if (!this.tokenExpiresAt) return true;
    return new Date() >= new Date(this.tokenExpiresAt);
  };

  PlugAndPlayXeroSettings.prototype.hasValidTokens = function() {
    return !!(this.accessToken && this.refreshToken && !this.isTokenExpired());
  };

  PlugAndPlayXeroSettings.prototype.isConnected = function() {
    return this.hasValidTokens() && this.isActive;
  };

  PlugAndPlayXeroSettings.prototype.getTenantList = function() {
    try {
      return this.tenants ? JSON.parse(this.tenants) : [];
    } catch (error) {
      console.error('❌ Error parsing tenants:', error);
      return [];
    }
  };

  PlugAndPlayXeroSettings.prototype.setTenantList = function(tenants) {
    this.tenants = JSON.stringify(tenants);
  };

  // Class methods
  PlugAndPlayXeroSettings.findByCompanyId = function(companyId) {
    return this.findOne({ where: { companyId } });
  };

  PlugAndPlayXeroSettings.findActiveIntegrations = function() {
    return this.findAll({ 
      where: { isActive: true },
      include: [
        {
          model: sequelize.models.Company,
          attributes: ['id', 'companyName', 'email']
        }
      ]
    });
  };

  PlugAndPlayXeroSettings.findExpiredTokens = function() {
    return this.findAll({
      where: {
        isActive: true,
        tokenExpiresAt: {
          [sequelize.Sequelize.Op.lt]: new Date()
        }
      }
    });
  };

  PlugAndPlayXeroSettings.findBySyncStatus = function(status) {
    return this.findAll({ where: { syncStatus: status } });
  };

  // Associations
  PlugAndPlayXeroSettings.associate = function(models) {
    // Belongs to Company
    PlugAndPlayXeroSettings.belongsTo(models.Company, {
      foreignKey: 'companyId',
      as: 'company'
    });
  };

  return PlugAndPlayXeroSettings;
};
