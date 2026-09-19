package com.cristiancamilo.finix.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TotalCajaDTO {
    private BigDecimal totalHistorico;
}
