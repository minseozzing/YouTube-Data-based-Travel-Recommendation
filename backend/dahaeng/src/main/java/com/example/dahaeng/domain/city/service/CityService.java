package com.example.dahaeng.domain.city.service;

import com.example.dahaeng.domain.city.dto.response.CitiesResponse;
import com.example.dahaeng.domain.city.entity.City;
import com.example.dahaeng.domain.city.repository.CityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CityService {
    private final CityRepository cityRepository;

    public List<City> getAllCities(){
        return cityRepository.findAll();
    }
}
