package com.cristiancamilo.finix.mapper;

import com.cristiancamilo.finix.dto.ProductoDTO;
import com.cristiancamilo.finix.model.Producto;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ProductoMapper {

    ProductoMapper INSTANCE = Mappers.getMapper(ProductoMapper.class);

    ProductoDTO toDTO(Producto producto);

    Producto toEntity(ProductoDTO productoDTO);
}
