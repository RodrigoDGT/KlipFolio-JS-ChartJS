select distinct
	service_orders.id as "ID-OS",
	service_orders.number as "OS",
	service_orders.service_type as "Tipo da OS",
	customers.name as "Cliente",
	case 
		when service_orders.service_order_status = 'non_reviewed' then 'Não Revisado'
		when service_orders.service_order_status = 'reviewed' then 'Revisado'
		when service_orders.service_order_status = 'published' then 'Publicado'
		when service_orders.service_order_status = 'published_and_approved' then 'Publicado e Aprovado'
		when service_orders.service_order_status = 'pre' then 'Preparação'
		when service_orders.service_order_status = 'non_inspected' then 'Não Executado'
		when service_orders.service_order_status = 'pre' then 'Publicação Rejeitada'
	end as "Status",
	users.name as "Profissional de campo",
	child_so.id as "ID-OS Filha",
	child_so.service_type as "Tipo da OS Filha",
	case 
		when child_so.service_order_status = 'non_reviewed' then 'Não Revisado'
		when child_so.service_order_status = 'reviewed' then 'Revisado'
		when child_so.service_order_status = 'published' then 'Publicado'
		when child_so.service_order_status = 'published_and_approved' then 'Publicado e Aprovado'
		when child_so.service_order_status = 'pre' then 'Preparação'
		when child_so.service_order_status = 'non_inspected' then 'Não Executado'
		when child_so.service_order_status = 'pre' then 'Publicação Rejeitada'
	end as "Status Filha",
	child_users.name as "Profissional de validação",
	sites.name as "Localidade",
	machines.name as "Ativo",
	service_orders.created_at at time zone 'utc' at time zone 'America/Sao_Paulo' as "Data de Criação",
	service_orders.data_fiscalizacao at time zone 'utc' at time zone 'America/Sao_Paulo' as "Data de Não Revisado",
	child_so.created_at at time zone 'utc' at time zone 'America/Sao_Paulo' as "Data de Criação da Filha",

	(select min(versions.created_at at time zone 'utc' at time zone 'America/Sao_Paulo')
	from versions
	where versions.item_type = 'ServiceOrder'
	and versions.object_changes like concat('%','non_reviewed',CHR(10),'- reviewed','%')
	and versions.item_id = child_so.id) as "Data de Revisado da Filha",

	(select min(versions.created_at at time zone 'utc' at time zone 'America/Sao_Paulo')
	from versions
	where versions.item_type = 'ServiceOrder'
	and versions.object_changes like concat('%','non_reviewed',CHR(10),'- reviewed','%')
	and versions.item_id = service_orders.id) as "Data de Revisado",
    
	service_orders.updated_at at time zone 'utc' at time zone 'America/Sao_Paulo' as "Data de Alteração"
	from public.service_orders
	left join service_orders child_so on child_so.parent_id = service_orders.id
	left join sites on sites.id = service_orders.site_id
	left join users on users.id = service_orders.user_id
	left join users child_users on child_users.id = child_so.user_id
	left join customers on customers.id = service_orders.customer_id
	left join machines on machines.id = service_orders.machine_id
	left join versions on versions.item_id = service_orders.id
	where service_orders.company_id = 273
		and service_orders.deleted_at isnull
		and service_orders.service_type = 'Implantação'
        and 
        (
            service_orders.created_at at time zone 'utc' at time zone 'America/Sao_Paulo' >= TO_TIMESTAMP('{props.handoverDateStart}', 'DD/MM/YYYY') -- Data de Criação
            or service_orders.data_fiscalizacao at time zone 'utc' at time zone 'America/Sao_Paulo' >= TO_TIMESTAMP('{props.handoverDateStart}', 'DD/MM/YYYY') -- Data de Não Revisado
            or child_so.created_at at time zone 'utc' at time zone 'America/Sao_Paulo' >= TO_TIMESTAMP('{props.handoverDateStart}', 'DD/MM/YYYY')  -- Data de Criação da Filha
            or (select min(versions.created_at at time zone 'utc' at time zone 'America/Sao_Paulo')
                from versions
                where versions.item_type = 'ServiceOrder'
                and versions.object_changes like concat('%','non_reviewed',CHR(10),'- reviewed','%')
                and versions.item_id = child_so.id) >= TO_TIMESTAMP('{props.handoverDateStart}', 'DD/MM/YYYY')  -- Data de Revisado da Filha
            or (select min(versions.created_at at time zone 'utc' at time zone 'America/Sao_Paulo')
                from versions
                where versions.item_type = 'ServiceOrder'
                and versions.object_changes like concat('%','non_reviewed',CHR(10),'- reviewed','%')
                and versions.item_id = service_orders.id) at time zone 'utc' at time zone 'America/Sao_Paulo' <= TO_TIMESTAMP('{props.handoverDateEnd}', 'DD/MM/YYYY')  -- Data de Revisado
        )
        and         
        CASE 
            WHEN customers.name = '{props.handoverClient}' THEN true 
            WHEN '{props.handoverClient}' = 'Todos' THEN true 
            ELSE false 
        END



--         (
--             service_orders.created_at at time zone 'utc' at time zone 'America/Sao_Paulo' >= TO_TIMESTAMP('{props.handoverDateStart}', 'DD/MM/YYYY') -- Data de Criação
--             or service_orders.data_fiscalizacao at time zone 'utc' at time zone 'America/Sao_Paulo' >= TO_TIMESTAMP({'props.handoverDateStart'}, 'DD/MM/YYYY') -- Data de Não Revisado
--             or child_so.created_at at time zone 'utc' at time zone 'America/Sao_Paulo' >= TO_TIMESTAMP({'props.handoverDateStart'}, 'DD/MM/YYYY')  -- Data de Criação da Filha
--             or (select min(versions.created_at at time zone 'utc' at time zone 'America/Sao_Paulo')
--                 from versions
--                 where versions.item_type = 'ServiceOrder'
--                 and versions.object_changes like concat('%','non_reviewed',CHR(10),'- reviewed','%')
--                 and versions.item_id = child_so.id) >= TO_TIMESTAMP({'props.handoverDateStart'}, 'DD/MM/YYYY')  -- Data de Revisado da Filha
--             or (select min(versions.created_at at time zone 'utc' at time zone 'America/Sao_Paulo')
--                 from versions
--                 where versions.item_type = 'ServiceOrder'
--                 and versions.object_changes like concat('%','non_reviewed',CHR(10),'- reviewed','%')
--                 and versions.item_id = service_orders.id) at time zone 'utc' at time zone 'America/Sao_Paulo' <= TO_TIMESTAMP('{props.handoverDateEnd}', 'DD/MM/YYYY')  -- Data de Revisado
--         )and 
--         (
--             case 
--                 when customers.name = '{props.handoverClient}' then '{props.handoverClient}'
--                 when customers.name 
--             end
--         )
--         (
--         '{props.handoverClient}' = 'Todos'
--         OR customers.name = '{props.handoverClient}'
--     )
-- --TO_TIMESTAMP({props.handoverDateStart}, 'DD/MM/YYYY')

--         (
--             (service_orders.created_at at time zone 'utc' at time zone 'America/Sao_Paulo', '%Y-%m-%d') >= {props.handoverDateStart} -- Data de Criação
--             or (service_orders.data_fiscalizacao at time zone 'utc' at time zone 'America/Sao_Paulo', '%Y-%m-%d') >= {props.handoverDateStart} -- Data de Não Revisado
--             or (child_so.created_at at time zone 'utc' at time zone 'America/Sao_Paulo', '%Y-%m-%d') >= {props.handoverDateStart}  -- Data de Criação da Filha
--             or ((select min(versions.created_at at time zone 'utc' at time zone 'America/Sao_Paulo')
--                 from versions
--                 where versions.item_type = 'ServiceOrder'
--                 and versions.object_changes like concat('%','non_reviewed',CHR(10),'- reviewed','%')
--                 and versions.item_id = child_so.id), '%Y-%m-%d') >= {props.handoverDateStart}  -- Data de Revisado da Filha
--             or ((select min(versions.created_at at time zone 'utc' at time zone 'America/Sao_Paulo')
--                 from versions
--                 where versions.item_type = 'ServiceOrder'
--                 and versions.object_changes like concat('%','non_reviewed',CHR(10),'- reviewed','%')
--                 and versions.item_id = service_orders.id) at time zone 'utc' at time zone 'America/Sao_Paulo', '%Y-%m-%d') <= {props.handoverDateEnd}  -- Data de Revisado
--         )and 
--         (
--             case 
--             when {props.handoverClient} = 'Todos' then true
--             else customers.name = {props.handoverClient} end
--         )





select distinct
    service_orders.id as "ID-OS",
    service_orders.number as "OS",
    service_orders.service_type as "Tipo da OS",
    customers.name as "Cliente",
    case 
        when service_orders.service_order_status = 'non_reviewed' then 'Não Revisado'
        when service_orders.service_order_status = 'reviewed' then 'Revisado'
        when service_orders.service_order_status = 'published' then 'Publicado'
        when service_orders.service_order_status = 'published_and_approved' then 'Publicado e Aprovado'
        when service_orders.service_order_status = 'pre' then 'Preparação'
        when service_orders.service_order_status = 'non_inspected' then 'Não Executado'
        when service_orders.service_order_status = 'pre' then 'Publicação Rejeitada'
    end as "Status",
    users.name as "Profissional de campo",
    child_so.id as "ID-OS Filha",
    child_so.service_type as "Tipo da OS Filha",
    case 
        when child_so.service_order_status = 'non_reviewed' then 'Não Revisado'
        when child_so.service_order_status = 'reviewed' then 'Revisado'
        when child_so.service_order_status = 'published' then 'Publicado'
        when child_so.service_order_status = 'published_and_approved' then 'Publicado e Aprovado'
        when child_so.service_order_status = 'pre' then 'Preparação'
        when child_so.service_order_status = 'non_inspected' then 'Não Executado'
        when child_so.service_order_status = 'pre' then 'Publicação Rejeitada'
    end as "Status Filha",
    child_users.name as "Profissional de validação",
    sites.name as "Localidade",
    machines.name as "Ativo",
    TO_CHAR(service_orders.created_at at time zone 'utc' at time zone 'America/Sao_Paulo', 'DD/MM/YYYY') as "Data de Criação",
    TO_CHAR(service_orders.data_fiscalizacao at time zone 'utc' at time zone 'America/Sao_Paulo', 'DD/MM/YYYY') as "Data de Não Revisado",
    TO_CHAR(child_so.created_at at time zone 'utc' at time zone 'America/Sao_Paulo', 'DD/MM/YYYY') as "Data de Criação da Filha",
    TO_CHAR((select min(versions.created_at at time zone 'utc' at time zone 'America/Sao_Paulo')
    from versions
    where versions.item_type = 'ServiceOrder'
    and versions.object_changes like concat('%','non_reviewed',CHR(10),'- reviewed','%')
    and versions.item_id = service_orders.id),'DD/MM/YYYY') as "Data de Revisado",
	
    (select min(versions.created_at at time zone 'utc' at time zone 'America/Sao_Paulo')
    from versions
    where versions.item_type = 'ServiceOrder'
    and versions.object_changes like concat('%','non_reviewed',CHR(10),'- reviewed','%')
    and versions.item_id = service_orders.id),TO_CHAR(service_orders.updated_at at time zone 'utc' at time zone 'America/Sao_Paulo', 'DD/MM/YYYY') as "Data de Alteração"
    from public.service_orders
    left join service_orders child_so on child_so.parent_id = service_orders.id
    left join sites on sites.id = service_orders.site_id
    left join users on users.id = service_orders.user_id
    left join users child_users on child_users.id = child_so.user_id
    left join customers on customers.id = service_orders.customer_id
    left join machines on machines.id = service_orders.machine_id
    left join versions on versions.item_id = service_orders.id
    where service_orders.company_id = 273
        and service_orders.deleted_at isnull
        and service_orders.service_type = 'Implantação'
        and 
            service_orders.created_at at time zone 'utc' at time zone 'America/Sao_Paulo' >= TO_TIMESTAMP('{props.data_ha_ini}', 'DD/MM/YYYY') -- Data de Criação
            or service_orders.data_fiscalizacao at time zone 'utc' at time zone 'America/Sao_Paulo' >= TO_TIMESTAMP('{props.data_ha_ini}', 'DD/MM/YYYY') -- Data de Não Revisado
            or child_so.created_at at time zone 'utc' at time zone 'America/Sao_Paulo' >= TO_TIMESTAMP('{props.data_ha_ini}', 'DD/MM/YYYY')  -- Data de Criação da Filha
            or (select min(versions.created_at at time zone 'utc' at time zone 'America/Sao_Paulo')
                from versions
                where versions.item_type = 'ServiceOrder'
                and versions.object_changes like concat('%','non_reviewed',CHR(10),'- reviewed','%')
                and versions.item_id = child_so.id) >= TO_TIMESTAMP('{props.data_ha_ini}', 'DD/MM/YYYY')  -- Data de Revisado da Filha
            or (select min(versions.created_at at time zone 'utc' at time zone 'America/Sao_Paulo')
                from versions
                where versions.item_type = 'ServiceOrder'
                and versions.object_changes like concat('%','non_reviewed',CHR(10),'- reviewed','%')
                and versions.item_id = service_orders.id) at time zone 'utc' at time zone 'America/Sao_Paulo' <= TO_TIMESTAMP('{props.data_ha_fin}', 'DD/MM/YYYY')  -- Data de Revisado
        and         
        CASE 
            WHEN customers.name = '{props.data_ha_cliente}' THEN true 
            WHEN '{props.data_ha_cliente}' = 'Todos' THEN true 
            ELSE false END