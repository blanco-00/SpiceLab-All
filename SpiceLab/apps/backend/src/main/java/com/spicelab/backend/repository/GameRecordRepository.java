package com.spicelab.backend.repository;

import com.spicelab.backend.model.GameRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface GameRecordRepository extends JpaRepository<GameRecord, String> {
    Optional<GameRecord> findByRoomId(String roomId);
    boolean existsByRoomId(String roomId);
}
