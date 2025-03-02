package com.backend.backend.Repository;

import com.backend.backend.Model.Task;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepo extends MongoRepository<Task, String> {

}
