

export const permissionContribution = {
    "organization.teams.inviteMember": {
        "enumDescriptions": [
            "Has ability to invite new members.",
            "No ability to invite new members"
        ],
        "description": "Invite new members",
        "type": "string",
        "enum": [
            "Allow",
            "Deny",
            "NotSet"
        ],
        "default": "NotSet",
        "scope": 4
    },
    "organization.teams.view": {
        "enumDescriptions": [
            "Has ability to view existing teams.",
            "No ability to create existing teams"
        ],
        "description": "View existing teams",
        "type": "string",
        "enum": [
            "Allow",
            "Deny",
            "NotSet"
        ],
        "default": "NotSet",
        "scope": 4
    },
    "organization.teams.create": {
        "enumDescriptions": [
            "Has ability to create new teams.",
            "No ability to create new teams"
        ],
        "description": "Create new teams",
        "type": "string",
        "enum": [
            "Allow",
            "Deny",
            "NotSet"
        ],
        "default": "NotSet",
        "scope": 4
    },
    "organization.teams.edit": {
        "enumDescriptions": [
            "Has ability to edit existing teams.",
            "No ability to edit existing teams"
        ],
        "description": "Edit existing teams",
        "type": "string",
        "enum": [
            "Allow",
            "Deny",
            "NotSet"
        ],
        "default": "NotSet",
        "scope": 4
    },
    "organization.teams.delete": {
        "enumDescriptions": [
            "Has ability to delete existing teams.",
            "No ability to delete existing teams"
        ],
        "description": "Delete existing teams",
        "type": "string",
        "enum": [
            "Allow",
            "Deny",
            "NotSet"
        ],
        "default": "NotSet",
        "scope": 4
    },
    "organization.teams.manage": {
        "enumDescriptions": [
            "Has ability to manage teams.",
            "No ability to manage teams"
        ],
        "description": "Manage new/existing Teams",
        "type": "string",
        "enum": [
            "Allow",
            "Deny",
            "NotSet"
        ],
        "default": "NotSet",
        "scope": 4
    },
    "organization.projects.view": {
        "enumDescriptions": [
            "Has ability to view existing workspace.",
            "No ability to view existing workspace"
        ],
        "description": "View Workspace",
        "type": "string",
        "enum": [
            "Allow",
            "Deny",
            "NotSet"
        ],
        "default": "NotSet",
        "scope": 4
    },
    "organization.projects.create": {
        "enumDescriptions": [
            "Has ability to create new workspace.",
            "No ability to create new workspace"
        ],
        "description": "Create Workspace",
        "type": "string",
        "enum": [
            "Allow",
            "Deny",
            "NotSet"
        ],
        "default": "NotSet",
        "scope": 4
    },
    "organization.projects.edit": {
        "enumDescriptions": [
            "Has ability to edit existing workspace.",
            "No ability to edit existing workspace"
        ],
        "description": "Edit Workspace",
        "type": "string",
        "enum": [
            "Allow",
            "Deny",
            "NotSet"
        ],
        "default": "NotSet",
        "scope": 4
    },
    "organization.projects.delete": {
        "enumDescriptions": [
            "Has ability to delete workspace.",
            "No ability to delete workspace."
        ],
        "description": "Delete Workspace",
        "type": "string",
        "enum": [
            "Allow",
            "Deny",
            "NotSet"
        ],
        "default": "NotSet",
        "scope": 4
    },
    "organization.projects.manage": {
        "enumDescriptions": [
            "Has ability to manage new/existing workspace.",
            "No ability to manage new/existing  workspace"
        ],
        "description": "Manage Workspace",
        "type": "string",
        "enum": [
            "Allow",
            "Deny",
            "NotSet"
        ],
        "default": "NotSet",
        "scope": 4
    }
}
