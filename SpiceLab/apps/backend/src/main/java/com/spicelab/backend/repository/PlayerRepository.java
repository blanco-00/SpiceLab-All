package com.spicelab.backend.repository;

import com.spicelab.backend.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PlayerRepository extends JpaRepository<Player, String> {
    List<Player> findByRoomId(String roomId);
    List<Player> findByRoomIdAndLeftAtIsNull(String roomId);
    Optional<Player> findByIdAndRoomId(String id, String roomId);
    long countByRoomIdAndLeftAtIsNull(String roomId);
}
