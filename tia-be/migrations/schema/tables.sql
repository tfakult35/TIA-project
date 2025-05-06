CREATE TABLE "public"."users" (
    "user_id" SERIAL PRIMARY KEY,
    "username" varchar(100) NOT NULL UNIQUE,
    "password" varchar(100) NOT NULL,
    "user_desc" text NOT NULL
);

CREATE TABLE "public"."friendships" (
    "user_id1" INT NOT NULL,
    "user_id2" INT NOT NULL,
    PRIMARY KEY ("user_id1", "user_id2"),
    FOREIGN KEY ("user_id1") REFERENCES "public"."users"("user_id") ON DELETE CASCADE, 
    FOREIGN KEY ("user_id2") REFERENCES "public"."users"("user_id") ON DELETE CASCADE,
    CHECK ("user_id1" < "user_id2")   
);


CREATE TABLE "public"."friends_requests" (
    "user_id_req" INT NOT NULL,
    "user_id_rec" INT NOT NULL,
    PRIMARY KEY ("user_id_req", "user_id_rec"),
    FOREIGN KEY ("user_id_req") REFERENCES "public"."users"("user_id") ON DELETE CASCADE, 
    FOREIGN KEY ("user_id_rec") REFERENCES "public"."users"("user_id") ON DELETE CASCADE,
)

CREATE TABLE "public"."groups" (
    "group_id" SERIAL PRIMARY KEY,
    "group_name" varchar(100) NOT NULL UNIQUE,
    "group_desc" varchar(1000) NOT NULL
);

CREATE TABLE "public"."files" (
    "file_id" SERIAL PRIMARY KEY,
    "file_name" varchar(100) NOT NULL,
    "created_time" TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    "modified_time" TIMESTAMP NOT NULL,
    "topic" text NOT NULL,
    "content" text NOT NULL
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

CREATE TABLE "public"."user_files" (
    "user_id" INT NOT NULL,
    "file_id" INT NOT NULL,
    PRIMARY KEY ("user_id", "file_id"),
    FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE CASCADE,
    FOREIGN KEY ("file_id") REFERENCES "public"."files"("file_id") ON DELETE CASCADE  
)

CREATE TABLE "public"."group_files" (
    "group_id" INT NOT NULL,
    "file_id" INT NOT NULL UNIQUE, --delete this comment after updating db definition 
    PRIMARY KEY ("group_id", "file_id"),
    FOREIGN KEY ("group_id") REFERENCES "public"."groups"("group_id") ON DELETE CASCADE,
    FOREIGN KEY ("file_id") REFERENCES "public"."files"("file_id") ON DELETE CASCADE  
)

CREATE TABLE "public"."group_members"(
    "group_id" INT NOT NULL,
    "user_id" INT NOT NULL,
    PRIMARY KEY ("group_id", "user_id"),
    FOREIGN KEY ("group_id") REFERENCES "public"."groups"("group_id") ON DELETE CASCADE,
    FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE CASCADE  

)


CREATE TABLE "public"."groups_requests" ( ------ delete this after update db definition
    "user_id_req" INT NOT NULL,
    "group_id_rec" INT NOT NULL,
    PRIMARY KEY ("user_id_req", "group_id_rec"),
    FOREIGN KEY ("user_id_req") REFERENCES "public"."users"("user_id") ON DELETE CASCADE, 
    FOREIGN KEY ("group_id_rec") REFERENCES "public"."groups"("group_id") ON DELETE CASCADE,
)