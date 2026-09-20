package com.careerlink.application.controller;

import com.careerlink.application.dto.ApiResponse;
import com.careerlink.application.dto.OfferRequest;
import com.careerlink.application.model.OfferDocument;
import com.careerlink.application.service.OfferService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/offers")
@RequiredArgsConstructor
public class OfferController {
    private final OfferService offerService;

    @PostMapping
    public ResponseEntity<ApiResponse<OfferDocument>> createOffer(
            @RequestHeader(name = "X-User-Id") String userId,
            @RequestHeader(name = "X-User-Role") String role,
            @Valid @RequestBody OfferRequest request) {
        OfferDocument offer = offerService.createOffer(userId, role, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Offer created successfully", offer));
    }

    @GetMapping("/candidate")
    public ResponseEntity<ApiResponse<List<OfferDocument>>> getCandidateOffers(
            @RequestHeader(name = "X-User-Id") String userId) {
        return ResponseEntity.ok(ApiResponse.ok(offerService.getCandidateOffers(userId)));
    }

    @GetMapping("/recruiter")
    public ResponseEntity<ApiResponse<List<OfferDocument>>> getRecruiterOffers(
            @RequestHeader(name = "X-User-Id") String userId) {
        return ResponseEntity.ok(ApiResponse.ok(offerService.getRecruiterOffers(userId)));
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<ApiResponse<OfferDocument>> acceptOffer(
            @PathVariable String id,
            @RequestHeader(name = "X-User-Id") String userId) {
        return ResponseEntity.ok(ApiResponse.ok(offerService.acceptOffer(userId, id)));
    }

    @PutMapping("/{id}/decline")
    public ResponseEntity<ApiResponse<OfferDocument>> declineOffer(
            @PathVariable String id,
            @RequestHeader(name = "X-User-Id") String userId) {
        return ResponseEntity.ok(ApiResponse.ok(offerService.declineOffer(userId, id)));
    }
}
