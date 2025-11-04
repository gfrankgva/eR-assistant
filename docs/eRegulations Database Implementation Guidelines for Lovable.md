# eRegulations Database Implementation Guidelines for Lovable

## Introduction

This document provides implementation guidelines for creating a database based on the eRegulations API structure found at https://gdb.dev.els.eregistrations.org/swagger/. These guidelines will help Lovable create a database that aligns with the API's data models and supports the necessary operations.

## Database Design

### Core Tables

1. **data_admin**
   ```sql
   CREATE TABLE data_admin (
       id SERIAL PRIMARY KEY,
       uuid VARCHAR(36) NOT NULL UNIQUE,
       registry_number VARCHAR(100),
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       -- Additional fields to be determined through API exploration
       CONSTRAINT uk_data_admin_uuid UNIQUE (uuid)
   );
   ```

2. **data_view_groups**
   ```sql
   CREATE TABLE data_view_groups (
       id SERIAL PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       description TEXT,
       order_index INTEGER,
       parent_id INTEGER,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       CONSTRAINT fk_data_view_groups_parent FOREIGN KEY (parent_id) 
           REFERENCES data_view_groups (id) ON DELETE CASCADE
   );
   ```

3. **data**
   ```sql
   CREATE TABLE data (
       id SERIAL PRIMARY KEY,
       code VARCHAR(100) NOT NULL,
       version VARCHAR(50) NOT NULL,
       content JSONB,
       status VARCHAR(50),
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       CONSTRAINT uk_data_code_version UNIQUE (code, version)
   );
   ```

4. **data_exports**
   ```sql
   CREATE TABLE data_exports (
       id SERIAL PRIMARY KEY,
       sync_id VARCHAR(100) NOT NULL UNIQUE,
       data_id INTEGER NOT NULL,
       status VARCHAR(50) NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       CONSTRAINT fk_data_exports_data FOREIGN KEY (data_id) 
           REFERENCES data (id) ON DELETE CASCADE
   );
   ```

### Indexes

```sql
-- Improve lookup performance
CREATE INDEX idx_data_code ON data (code);
CREATE INDEX idx_data_code_version ON data (code, version);
CREATE INDEX idx_data_view_groups_parent_id ON data_view_groups (parent_id);
CREATE INDEX idx_data_exports_sync_id ON data_exports (sync_id);
CREATE INDEX idx_data_admin_registry_number ON data_admin (registry_number);
```

## Implementation Steps

1. **Database Setup**
   - Choose a database system (PostgreSQL recommended for JSONB support)
   - Create a new database named `eregulations_db`
   - Create a dedicated user with appropriate permissions

2. **Schema Creation**
   - Execute the table creation scripts provided above
   - Create indexes for performance optimization
   - Set up constraints to maintain data integrity

3. **API Integration Layer**
   - Create data access objects (DAOs) or repositories for each table
   - Implement methods that mirror the API endpoints
   - Add validation logic to ensure data consistency

4. **Testing**
   - Create test cases for CRUD operations on each table
   - Verify that relationships work as expected
   - Test with sample data from the API if available

## Data Migration Considerations

If migrating data from the API to the database:

1. **Extraction Process**
   - Use the GET endpoints to retrieve existing data
   - Process data in batches to avoid overwhelming the API
   - Log all operations for audit purposes

2. **Transformation**
   - Map API response fields to database columns
   - Handle any data type conversions
   - Resolve any inconsistencies or missing values

3. **Loading**
   - Insert data in the correct order to maintain relationships
   - Use transactions to ensure atomicity
   - Validate data after loading

## Extending the Schema

As more information becomes available through API usage, the database schema may need to be extended:

```sql
-- Example of adding new fields to data_admin
ALTER TABLE data_admin ADD COLUMN metadata JSONB;
ALTER TABLE data_admin ADD COLUMN status VARCHAR(50);

-- Example of creating a new relationship table
CREATE TABLE data_admin_relationships (
    id SERIAL PRIMARY KEY,
    source_id INTEGER NOT NULL,
    target_id INTEGER NOT NULL,
    relationship_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_data_admin_rel_source FOREIGN KEY (source_id) 
        REFERENCES data_admin (id) ON DELETE CASCADE,
    CONSTRAINT fk_data_admin_rel_target FOREIGN KEY (target_id) 
        REFERENCES data_admin (id) ON DELETE CASCADE
);
```

## Best Practices

1. **Use Transactions**
   - Wrap related operations in transactions to maintain consistency
   - Example:
     ```sql
     BEGIN;
     INSERT INTO data_view_groups (name, description) VALUES ('Group 1', 'Description');
     -- Get the ID of the inserted group
     INSERT INTO data_view_groups (name, description, parent_id) 
         VALUES ('Subgroup 1', 'Description', currval('data_view_groups_id_seq'));
     COMMIT;
     ```

2. **Version Management**
   - Implement a strategy for handling data versions
   - Consider using temporal tables for historical tracking

3. **Error Handling**
   - Implement robust error handling for database operations
   - Log errors with sufficient context for debugging

4. **Performance Optimization**
   - Use appropriate indexes for frequently queried fields
   - Consider partitioning large tables by code or date ranges
   - Implement caching for frequently accessed data

## Limitations and Recommendations

1. **Schema Evolution**
   - The database schema should be designed to evolve as more API details are discovered
   - Use flexible data types like JSONB for fields that may contain varying structures

2. **API Synchronization**
   - Consider implementing a synchronization mechanism to keep the database updated with API changes
   - Use webhooks or periodic polling depending on API capabilities

3. **Documentation**
   - Maintain comprehensive documentation of the database schema
   - Document any assumptions made during implementation

## Conclusion

This implementation guide provides a starting point for creating a database based on the eRegulations API. The provided schema captures the core entities and relationships visible in the API documentation, but should be treated as a foundation that will evolve with further API exploration and usage.

Lovable should approach this as an iterative process, starting with the core tables and relationships, and then refining the schema as more information becomes available through actual API usage.
