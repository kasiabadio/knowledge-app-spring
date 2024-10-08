package com.example.knowledge;

import com.example.knowledge.API.KnowledgeController;
import com.example.knowledge.models.Knowledge;
import com.example.knowledge.services.KnowledgeService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.stream.Stream;
import static org.mockito.BDDMockito.given;
import static org.junit.jupiter.api.Assertions.assertEquals;


@ExtendWith(MockitoExtension.class)
public class KnowledgeControllerTest {

    @InjectMocks
    private KnowledgeController knowledgeController;

    @Mock
    private KnowledgeService knowledgeService;

    private Knowledge knowledge;

    private Knowledge createKnowledgeItem(String title, String author, String content){
        Knowledge knowledge = new Knowledge();
        knowledge.setIdKnowledge(1L);
        knowledge.setTitle(title);
        knowledge.setAuthor(author);
        knowledge.setContent(content);
        return knowledge;
    }

    public void setup(){
        knowledge = createKnowledgeItem("Hello world knowledge", "Mock Mockito", "content of a test");

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSSSSS");
        LocalDateTime localDateTime = LocalDateTime.parse("2024-07-17 15:46:06.903000", formatter);
        Date date = Date.from(localDateTime.atZone(ZoneId.systemDefault()).toInstant());

        knowledge.setCreatedDate(date);
        knowledge.setLastModifiedDate(date);
    }

    @DisplayName("Controller: Test get knowledge by id")
    @Test
    public void getKnowledgeById_givenId_willReturnThisIdKnowledge(){

        given(knowledgeService.getKnowledgeById(knowledge.getIdKnowledge())).willReturn(knowledge);

        ResponseEntity<Knowledge> responseEntity = knowledgeController.getKnowledgeById(knowledge.getIdKnowledge());
        Knowledge response = responseEntity.getBody();

        assertEquals(responseEntity.getStatusCode(), HttpStatus.OK);
        assertEquals(response.getTitle(), "Test getAllKnowledge");
        assertEquals(response.getContent(), "content of a test");
    }

    @DisplayName("Controller: Test create new knowledge")
    @Test
    public void createKnowledge_givenValidBody_willReturnNewKnowledge(){
        given(knowledgeService.createKnowledge(knowledge)).willReturn(knowledge);

        ResponseEntity<Knowledge> responseEntityNew = knowledgeController.createKnowledge(knowledge);
        Knowledge response = responseEntityNew.getBody();

        assertEquals(responseEntityNew.getStatusCode(), HttpStatus.OK);
        assertEquals(response.getIdKnowledge(), 1L);
        assertEquals(response.getTitle(), "Test getAllKnowledge");
        assertEquals(response.getAuthor(), "Mock Mockito");
        assertEquals(response.getContent(), "content of a test");
    }

    @DisplayName("Controller: Test update new knowledge")
    @Test
    public void updateKnowledge_givenValidBody_willReturnNewKnowledge(){

        Knowledge knowledgeUpdated = createKnowledgeItem("Updated: Test getAllKnowledge", "Updated: Mock Mockito", "Updated: content of a test");

        given(knowledgeService.updateKnowledge(knowledge)).willReturn(knowledgeUpdated);

        ResponseEntity<Knowledge> responseEntityNew = knowledgeController.updateKnowledge(knowledge);
        Knowledge response = responseEntityNew.getBody();

        assertEquals(responseEntityNew.getStatusCode(), HttpStatus.OK);
        assertEquals(response.getIdKnowledge(), 1L);
        assertEquals(response.getTitle(), "Updated: Test getAllKnowledge");
        assertEquals(response.getAuthor(), "Updated: Mock Mockito");
        assertEquals(response.getContent(), "Updated: content of a test");
    }

    @DisplayName("Controller: Test get all knowledge")
    @Test
    public void getAllKnowledge_givenNoInput_willReturnAllKnowledge() throws GlobalExceptionHandler.EmptyListException {

        Knowledge knowledgeOne = createKnowledgeItem("Test getAllKnowledge", "Mock Mockito One", "content of a test");
        Knowledge knowledgeTwo = createKnowledgeItem("Test getAllKnowledge", "Mock Mockito Two", "content of a test");

        List<Knowledge> allKnowledge = Arrays.asList(knowledgeOne, knowledgeTwo);
        given(knowledgeService.getAllKnowledge()).willReturn(allKnowledge);

        ResponseEntity<List<Knowledge>> responseEntity = knowledgeController.getAllKnowledge();
        List<Knowledge> response = responseEntity.getBody();

        assertEquals(responseEntity.getStatusCode(), HttpStatus.OK);
        assertEquals(2, response.size());
        Stream<Knowledge> responseAsStream = response.stream();

        responseAsStream.forEach(resp -> {
            assertEquals(resp.getTitle(), "Test getAllKnowledge");
            assertEquals(resp.getContent(), "content of a test");
        });

    }
}
