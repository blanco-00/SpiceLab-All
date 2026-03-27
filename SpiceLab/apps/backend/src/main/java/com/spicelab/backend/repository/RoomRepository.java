package com.spicelab.backend.repository;

import com.spicelab.backend.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, String> {
    Optional<Room> findByCode(String code);
    boolean existsByCode(String code);
}
