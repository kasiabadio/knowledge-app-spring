package com.example.knowledge;

import com.example.knowledge.models.Knowledge;
import com.example.knowledge.repositories.KnowledgeRepository;
import com.example.knowledge.services.KnowledgeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.junit.jupiter.api.Assertions.assertEquals;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class KnowledgeServiceTest {

    @InjectMocks
    private KnowledgeService knowledgeService;

    @Mock
    private KnowledgeRepository knowledgeRepository;

    private Knowledge knowledge;

    @BeforeEach
    public void setup(){
        knowledge = new Knowledge();
        knowledge.setIdKnowledge(1L);
        knowledge.setTitle("Hello world knowledge");
        knowledge.setContent("Hello content world");
        knowledge.setAuthor("Mock Mockito");

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSSSSS");
        LocalDateTime localDateTime = LocalDateTime.parse("2024-07-17 15:46:06.903000", formatter);
        Date date = Date.from(localDateTime.atZone(ZoneId.systemDefault()).toInstant());

        knowledge.setCreatedDate(date);
        knowledge.setLastModifiedDate(date);
    }

    @DisplayName("Service: Test get knowledge by id")
    @Test
    public void getKnowledgeById_givenId_willReturnThisIdKnowledge(){
        given(knowledgeRepository.findById(1L)).willReturn(Optional.of(knowledge));
        Knowledge newKnowledge = knowledgeService.getKnowledgeById(knowledge.getIdKnowledge());
        assertThat(newKnowledge).isNotNull();
        assertEquals(newKnowledge.getIdKnowledge(), 1L);
        assertEquals(newKnowledge.getTitle(), "Hello world knowledge");
        assertEquals(newKnowledge.getAuthor(), "Mock Mockito");
        assertEquals(newKnowledge.getContent(), "Hello content world");
    }

    @DisplayName("Service: Test create knowledge")
    @Test
    public void createKnowledge_whenSaveKnowledge_thenReturnKnowledgeObject(){
        given(knowledgeRepository.save(knowledge)).willReturn(knowledge);
        Knowledge newKnowledge = knowledgeService.createKnowledge(knowledge);
        assertThat(newKnowledge).isNotNull();
    }

    @DisplayName("Service: Test update knowledge")
    @Test
    public void updateKnowledge_whenUpdateKnowledge_thenReturnUpdatedKnowledgeObject(){
        given(knowledgeRepository.save(knowledge)).willReturn(knowledge);
        when(knowledgeRepository.findById(1L)).thenReturn(Optional.ofNullable(knowledge));
        knowledge.setContent("UPDATED CONTENT");
        knowledge.setAuthor("Ram Ram");
        Knowledge newKnowledge = knowledgeService.updateKnowledge(knowledge);
        assertEquals(newKnowledge.getContent(), "UPDATED CONTENT");
        assertEquals(newKnowledge.getAuthor(), "Ram Ram");
    }

    @DisplayName("Service: Test get all knowledge")
    @Test
    public void getAllKnowledge_whenGetAllKnowledge_returnKnowledgeList(){
        Knowledge knowledge2 = new Knowledge();
        knowledge2.setIdKnowledge(2L);
        knowledge2.setTitle("Hello world knowledge 2");
        knowledge2.setContent("Hello content world 2");
        knowledge2.setAuthor("Mock Mockito 2");
        List<Knowledge> list = new ArrayList<Knowledge>();
        list.add(knowledge);
        list.add(knowledge2);
        given(knowledgeRepository.findAll()).willReturn(list);
        List<Knowledge> knowledgeList = knowledgeService.getAllKnowledge();
        assertEquals(knowledgeList.size(), 2);
    }


}
