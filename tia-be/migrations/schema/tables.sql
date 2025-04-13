CREATE TABLE "public"."users" (
    "user_id" SERIAL PRIMARY KEY,
    "username" varchar(100) NOT NULL,
    "password" varchar(100) NOT NULL,
    "user_desc" varchar(1000) NOT NULL
);

CREATE TABLE "public"."friendships" (
    "user_id1" INT NOT NULL,
    "user_id2" INT NOT NULL,
    PRIMARY KEY ("user_id1", "user_id2"),
    FOREIGN KEY ("user_id1") REFERENCES "public"."users"("user_id") ON DELETE CASCADE, 
    FOREIGN KEY ("user_id2") REFERENCES "public"."users"("user_id") ON DELETE CASCADE   
);

CREATE TABLE "public"."groups" (
    "group_id" SERIAL PRIMARY KEY,
    "group_name" varchar(100) NOT NULL,
    "group_desc" varchar(1000) NOT NULL
);

CREATE TABLE "public"."files" (
    "file_id" SERIAL PRIMARY KEY,
    "file_name" varchar(100) NOT NULL,
    "created_time" TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    "modified_time" TIMESTAMP NOT NULL,
    "topic" varchar(1000) NOT NULL,
    "content" TEXT 
);

CREATE TABLE "public"."access_values" (
    "file_id" INT NOT NULL,
    "access_value" INT NOT NULL,
    PRIMARY KEY ("file_id", "access_value"),
    FOREIGN KEY ("file_id") REFERENCES "public"."files"("file_id") ON DELETE CASCADE  
);

CREATE TABLE "public"."file_hierarchy" (
    "file_id1" INT NOT NULL,
    "file_id2" INT NOT NULL,
    PRIMARY KEY ("file_id1", "file_id2"),
    FOREIGN KEY ("file_id1") REFERENCES "public"."files"("file_id") ON DELETE CASCADE,
    FOREIGN KEY ("file_id2") REFERENCES "public"."files"("file_id") ON DELETE CASCADE  
    
);