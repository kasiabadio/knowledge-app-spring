// Copyright 2024 Ali Bouali
// Licensed under the Apache License, Version 2.0 (the "License");
// You may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.example.knowledge.repositories;

import com.example.knowledge.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    @Query("SELECT u.idUser FROM User u WHERE u.email = :email")
    Optional<Long> getUserIdByEmail(@Param("email") String email);

    @Query("SELECT u FROM User u WHERE u.email = :email")
    Optional<User> getUserByEmail(@Param("email") String email);

    @Query("SELECT u FROM User u WHERE u.idUser = :idUser")
    Optional<User> getUserById(@Param("idUser") Long idUser);

    Optional<User> findByEmail(String email);

    @Query("SELECT DISTINCT u FROM User u " +
            "JOIN u.roles r " +
            "WHERE r.idRole IN (1, 2) AND r.idRole != 3")
    List<User> getUsersNotAdmins();
}
