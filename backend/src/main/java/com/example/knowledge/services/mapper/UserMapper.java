package com.example.knowledge.services.mapper;

import com.example.knowledge.models.Dto.UserDto;
import com.example.knowledge.models.User;

import java.util.List;
import java.util.stream.Collectors;

public class UserMapper {

    public static UserDto mapToUserDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setFirstName(user.getFirstName());
        userDto.setLastName(user.getLastName());
        userDto.setEmail(user.getEmail());
        userDto.setAccountLocked(user.isAccountLocked());
        userDto.setEnabled(user.isEnabled());
        userDto.setRoles(user.getRoles());
        userDto.setComments(user.getComments());
        userDto.setKnowledges(user.getKnowledges());
        return userDto;
    }

    public static List<UserDto> mapToUserDtoList(List<User> users) {
        return users.stream().map(UserMapper::mapToUserDto).collect(Collectors.toList());
    }

}
